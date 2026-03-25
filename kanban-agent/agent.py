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

from dotenv import load_dotenv
from github import Github
from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage, ToolMessage
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


def run_agent(task_id: str, description: str) -> dict:
    """Run the full agent flow for a task. Returns the final output string."""
    model_id = (
        os.environ.get("ANTHROPIC_DEFAULT_SONNET_MODEL")
        or os.environ.get("ANTHROPIC_MODEL")
        or "arn:aws:bedrock:eu-west-1:927750239225:application-inference-profile/o4qdiid0wrx1"
    )
    llm = ChatBedrockConverse(
        model=model_id,
        region_name=os.environ.get("AWS_REGION", "eu-west-1"),
        temperature=0,
    ).bind_tools(TOOLS)

    messages = [
        HumanMessage(
            content=f"System: {SYSTEM_PROMPT}\n\nTask ID: {task_id}\n\nTask description:\n{description}"
        )
    ]

    for _ in range(10):  # max iterations
        response = llm.invoke(messages)
        messages.append(response)

        if not response.tool_calls:
            # Final text response
            return {"output": response.content}

        # Execute each tool call and collect results
        for tc in response.tool_calls:
            tool_fn = TOOLS_BY_NAME[tc["name"]]
            try:
                result = tool_fn.invoke(tc["args"])
            except Exception as e:
                result = f"ERROR: {e}"
            messages.append(
                ToolMessage(content=str(result), tool_call_id=tc["id"])
            )

    return {"output": "Agent reached max iterations without completing."}
