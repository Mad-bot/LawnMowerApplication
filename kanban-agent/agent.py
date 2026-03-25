"""
LangChain agent that:
1. Creates an isolated git worktree for the task (never touches the main working tree)
2. Sends the task description to Claude via AWS Bedrock
3. Applies the LLM response as code changes inside the worktree
4. Commits and pushes
5. Opens a GitHub PR (guaranteed — done by run_agent if the LLM skips it)
"""

import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import boto3
from dotenv import load_dotenv
from github import Github
from langchain_core.tools import tool

load_dotenv()

REPO_PATH = Path(os.environ["REPO_LOCAL_PATH"])
GITHUB_REPO = os.environ["GITHUB_REPO"]

_repo = None


def _github_token() -> str:
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token or token.startswith("your_"):
        raise RuntimeError(
            "No GitHub token found. Use ./start.sh to launch the server "
            "(it refreshes the token automatically), or set GITHUB_TOKEN in .env."
        )
    return token


def _get_repo():
    global _repo
    # Always create a fresh client so token rotation / retries work correctly
    _repo = Github(_github_token()).get_repo(GITHUB_REPO)
    return _repo


def _git(args: list[str], cwd: Path = REPO_PATH) -> str:
    result = subprocess.run(
        ["git"] + args,
        cwd=cwd,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout.strip()


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


def _make_worktree(branch_name: str) -> Path:
    """Create an isolated git worktree for the branch in a temp directory."""
    _git(["fetch", "origin"])
    # Delete local branch if it already exists (e.g. from a previous failed attempt)
    _git(["branch", "-D", branch_name], cwd=REPO_PATH) if branch_name in _git(["branch"]) else None
    worktree_path = Path(tempfile.mkdtemp(prefix=f"vk-{branch_name.replace('/', '-')}-"))
    _git(["worktree", "add", "--no-checkout", str(worktree_path), "origin/master"])
    _git(["checkout", "-b", branch_name], cwd=worktree_path)
    _git(["checkout", "HEAD", "--", "."], cwd=worktree_path)
    return worktree_path


def _remove_worktree(worktree_path: Path) -> None:
    try:
        _git(["worktree", "remove", "--force", str(worktree_path)])
    except Exception:
        pass
    shutil.rmtree(worktree_path, ignore_errors=True)


# ── Per-task context (worktree_path is injected at agent run time) ────────────

def _make_tools(worktree_path: Path, branch_name: str):
    """Return tool instances bound to a specific worktree."""

    @tool
    def commit_and_push(file_path: str, content: str, commit_message: str) -> str:
        """Write content to a file path (relative to repo root), commit and push it."""
        target = worktree_path / file_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
        _git(["add", file_path], cwd=worktree_path)
        _git(["commit", "-m", commit_message], cwd=worktree_path)
        _git(["push", "-u", "origin", branch_name], cwd=worktree_path)
        return f"Pushed {file_path} on {branch_name}"

    @tool
    def open_pull_request(title: str, body: str) -> str:
        """Open a GitHub pull request for the current branch into master. Returns PR number."""
        from github import GithubException
        try:
            pr = _get_repo().create_pull(title=title, body=body, head=branch_name, base="master")
            return str(pr.number)
        except GithubException as e:
            if e.status == 422 and "already exists" in str(e.data):
                pulls = list(_get_repo().get_pulls(state="open", head=f"Mad-bot:{branch_name}"))
                if pulls:
                    return str(pulls[0].number)
            raise

    return [commit_and_push, open_pull_request]


# ── Bedrock helpers ───────────────────────────────────────────────────────────

def _bedrock_tool_spec(lc_tool) -> dict:
    schema = lc_tool.args_schema.model_json_schema()
    return {
        "toolSpec": {
            "name": lc_tool.name,
            "description": lc_tool.description,
            "inputSchema": {"json": schema},
        }
    }


def _open_or_get_pr(branch_name: str, description: str, task_id: str) -> int:
    """Create a PR, or return the existing one's number if it already exists."""
    from github import GithubException
    try:
        pr = _get_repo().create_pull(
            title=f"[Agent] {description[:72]}",
            body=f"Automated PR for task `{task_id}`.\n\n**Description:** {description}",
            head=branch_name,
            base="master",
        )
        return pr.number
    except GithubException as e:
        if e.status == 422 and "already exists" in str(e.data):
            # PR already open for this branch — fetch it
            pulls = list(_get_repo().get_pulls(state="open", head=f"Mad-bot:{branch_name}"))
            if pulls:
                return pulls[0].number
        raise


SYSTEM_PROMPT = """You are a software engineering agent working on the LawnMowerApplication TypeScript project.
Your worktree is already checked out on the correct branch — do NOT call any git branch/checkout commands.

You have two tools:
- commit_and_push(file_path, content, commit_message): write a file and push it
- open_pull_request(title, body): open the GitHub PR

Steps:
1. Implement the change by calling commit_and_push with the file path and full file content.
   - Only modify or create files under src/. Never touch node_modules, lib, or .git.
   - Write valid TypeScript consistent with the existing codebase style.
2. Call open_pull_request with a clear title and markdown body.

After completing, output a single JSON line: {"pr_number": <number>}"""


def run_agent(task_id: str, description: str) -> dict:
    """Run the full agent flow. Returns {"branch": str, "pr_number": int | None}."""
    branch_name = f"task/{task_id}-{_slug(description)}"
    worktree_path = _make_worktree(branch_name)
    try:
        return _run_loop(task_id, description, branch_name, worktree_path)
    finally:
        _remove_worktree(worktree_path)


def _run_loop(task_id: str, description: str, branch_name: str, worktree_path: Path) -> dict:
    model_id = (
        os.environ.get("ANTHROPIC_DEFAULT_SONNET_MODEL")
        or os.environ.get("ANTHROPIC_MODEL")
        or "arn:aws:bedrock:eu-west-1:927750239225:application-inference-profile/o4qdiid0wrx1"
    )
    region = os.environ.get("AWS_REGION", "eu-west-1")
    client = boto3.client("bedrock-runtime", region_name=region)

    tools = _make_tools(worktree_path, branch_name)
    tools_by_name = {t.name: t for t in tools}
    tool_config = {"tools": [_bedrock_tool_spec(t) for t in tools]}

    messages = [
        {"role": "user", "content": [{"text": f"Task ID: {task_id}\n\nTask description:\n{description}"}]}
    ]

    pr_number: int | None = None

    for _ in range(10):
        response = client.converse(
            modelId=model_id,
            system=[{"text": SYSTEM_PROMPT}],
            messages=messages,
            toolConfig=tool_config,
        )
        output_msg = response["output"]["message"]
        messages.append(output_msg)

        if response["stopReason"] != "tool_use":
            break

        tool_results = []
        for block in output_msg["content"]:
            if "toolUse" not in block:
                continue
            tool_use = block["toolUse"]
            tool_fn = tools_by_name[tool_use["name"]]
            try:
                result = tool_fn.invoke(tool_use["input"])
                if tool_use["name"] == "open_pull_request":
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

    # Guarantee PR is opened even if the LLM skipped that step
    if pr_number is None:
        pr_number = _open_or_get_pr(branch_name, description, task_id)

    return {"branch": branch_name, "pr_number": pr_number}
