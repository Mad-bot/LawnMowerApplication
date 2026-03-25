"""
LangChain agent that:
1. Creates a git branch for a task
2. Sends the task description to Claude
3. Applies the LLM response as code changes
4. Commits and pushes
5. Opens a GitHub PR
"""

import json
import os
import re
import subprocess
from pathlib import Path

import boto3
from dotenv import load_dotenv
from github import Github
from langchain_core.tools import tool

load_dotenv()

REPO_PATH = Path(os.environ["REPO_LOCAL_PATH"])
GITHUB_REPO = os.environ["GITHUB_REPO"]

_repo = None


def _get_repo():
    global _repo
    if _repo is None:
        gh = Github(os.environ["GITHUB_TOKEN"])
        _repo = gh.get_repo(GITHUB_REPO)
    return _repo


def _git(args: list[str]) -> str:
    result = subprocess.run(
        ["git"] + args,
        cwd=REPO_PATH,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout.strip()


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


@tool
def create_branch(task_id: str, description: str) -> str:
    """Create a new git branch for the task and check it out. Returns the branch name."""
    branch_name = f"task/{task_id}-{_slug(description)}"
    _git(["fetch", "origin"])
    _git(["checkout", "-b", branch_name, "origin/master"])
    return branch_name


@tool
def commit_and_push(branch_name: str, file_path: str, content: str, commit_message: str) -> str:
    """Write content to a file relative to the repo root, commit it, and push the branch to origin."""
    target = REPO_PATH / file_path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    _git(["add", str(target.relative_to(REPO_PATH))])
    _git(["commit", "-m", commit_message])
    _git(["push", "-u", "origin", branch_name])
    return f"Pushed {file_path} on branch {branch_name}"


@tool
def open_pull_request(branch_name: str, title: str, body: str) -> str:
    """Open a GitHub pull request from branch_name into master. Returns the PR number as a string."""
    pr = _get_repo().create_pull(
        title=title,
        body=body,
        head=branch_name,
        base="master",
    )
    return str(pr.number)


TOOLS = [create_branch, commit_and_push, open_pull_request]
TOOLS_BY_NAME = {t.name: t for t in TOOLS}

SYSTEM_PROMPT = """You are a software engineering agent working on the LawnMowerApplication TypeScript project.
You have tools to create a branch, commit files, and open a PR.

When given a task:
1. Call create_branch with the task_id and a short description slug.
2. Implement the change by calling commit_and_push with the appropriate file path and content.
   - Only modify or create files under src/. Never touch node_modules, lib, or .git.
   - Write valid TypeScript consistent with the existing codebase style.
3. Call open_pull_request with a clear title and markdown body describing what was done.

After all tool calls are complete, output a JSON object on its own line like:
{"branch": "<branch_name>", "pr_number": <number>}"""

# Convert langchain @tool definitions to Bedrock converse tool spec format
def _bedrock_tool_spec(lc_tool) -> dict:
    schema = lc_tool.args_schema.model_json_schema()
    return {
        "toolSpec": {
            "name": lc_tool.name,
            "description": lc_tool.description,
            "inputSchema": {"json": schema},
        }
    }


def run_agent(task_id: str, description: str) -> dict:
    """Run the full agent flow using boto3 bedrock-runtime converse API.

    Returns {"branch": str, "pr_number": int | None, "output": str}.
    The PR is opened here if the LLM didn't call open_pull_request itself.
    """
    model_id = (
        os.environ.get("ANTHROPIC_DEFAULT_SONNET_MODEL")
        or os.environ.get("ANTHROPIC_MODEL")
        or "arn:aws:bedrock:eu-west-1:927750239225:application-inference-profile/o4qdiid0wrx1"
    )
    region = os.environ.get("AWS_REGION", "eu-west-1")
    client = boto3.client("bedrock-runtime", region_name=region)
    tool_config = {"tools": [_bedrock_tool_spec(t) for t in TOOLS]}

    messages = [
        {"role": "user", "content": [{"text": f"Task ID: {task_id}\n\nTask description:\n{description}"}]}
    ]

    # Track results from tool calls so we can open the PR ourselves if needed
    branch: str | None = None
    pr_number: int | None = None

    for _ in range(10):  # max iterations
        response = client.converse(
            modelId=model_id,
            system=[{"text": SYSTEM_PROMPT}],
            messages=messages,
            toolConfig=tool_config,
        )

        output_msg = response["output"]["message"]
        messages.append(output_msg)
        stop_reason = response["stopReason"]

        if stop_reason != "tool_use":
            text = " ".join(b["text"] for b in output_msg["content"] if "text" in b)
            break

        # Execute each tool use block
        tool_results = []
        for block in output_msg["content"]:
            if "toolUse" not in block:
                continue
            tool_use = block["toolUse"]
            tool_fn = TOOLS_BY_NAME[tool_use["name"]]
            try:
                result = tool_fn.invoke(tool_use["input"])
                # Track branch and pr_number from tool outputs
                if tool_use["name"] == "create_branch":
                    branch = str(result)
                elif tool_use["name"] == "open_pull_request":
                    pr_number = int(result)
                tool_results.append({
                    "toolResult": {
                        "toolUseId": tool_use["toolUseId"],
                        "content": [{"text": str(result)}],
                    }
                })
            except Exception as e:
                tool_results.append({
                    "toolResult": {
                        "toolUseId": tool_use["toolUseId"],
                        "content": [{"text": f"ERROR: {e}"}],
                        "status": "error",
                    }
                })

        messages.append({"role": "user", "content": tool_results})

    # If the agent pushed a branch but never opened a PR, do it now
    if branch and pr_number is None:
        pr_number = int(open_pull_request.invoke({
            "branch_name": branch,
            "title": f"[Agent] {description[:72]}",
            "body": f"Automated PR for task `{task_id}`.\n\n**Description:** {description}",
        }))

    return {"branch": branch, "pr_number": pr_number, "output": description}
