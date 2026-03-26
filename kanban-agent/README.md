# Mad-bot - MultiTask Agent

An AI-powered task runner and kanban dashboard for the LawnMowerApplication repo. You describe a coding task in plain English; the agent implements it, pushes a branch, opens a GitHub PR, and tracks the PR lifecycle on a live board.

---

## Table of Contents

1. [How it works](#how-it-works)
2. [Architecture](#architecture)
3. [APIs used](#apis-used)
4. [REST API reference](#rest-api-reference)
5. [Data schema](#data-schema)
6. [Security](#security)
7. [Setup & run](#setup--run)
8. [Limitations](#limitations)
9. [Future iterations](#future-iterations)

---

## How it works

```
User types a task description
        │
        ▼
POST /tasks  ──► FastAPI spawns a background thread
        │
        ▼
agent.py creates an isolated git worktree
(origin/master → temp dir, new branch task/<id>-<slug>)
        │
        ▼
AWS Bedrock (Claude) receives the task + system prompt
with two tools available:
  • commit_and_push(file_path, content, commit_message)
  • open_pull_request(title, body)
        │
        ▼
Agent writes files, commits, pushes, opens PR
        │
        ▼
Task status updated to "pr_open" in tasks.json
        │
        ▼
github_poller (every 30 s) checks PR state:
  open → commented → approved → merged / closed
        │
        ▼
Frontend (every 10 s on board, 5 s on detail view)
polls GET /tasks and moves cards through columns
```

Each task runs in a fully isolated temporary git worktree — the main working tree is never touched. When the task finishes (or fails), the worktree is deleted.

**Follow-up flow**: clicking a task card opens the detail view. You can send a follow-up prompt; the agent resumes on the same branch using the full prior conversation as context, then pushes new commits to the existing PR.

---

## Architecture

```
kanban-agent/
├── main.py            FastAPI app — task lifecycle, REST endpoints, background threads
├── agent.py           Core agent — git worktree management, Bedrock loop, tool definitions
├── store.py           JSON-backed task store (tasks.json), thread-safe with a lock
├── github_poller.py   Background thread — polls GitHub PR status every 30 s
├── start.sh           Launcher — refreshes GitHub token from gh CLI, starts uvicorn
└── static/
    └── index.html     Kanban SPA — vanilla JS, two views (board / detail), no build step
```

### Component responsibilities

**`main.py`**
- Exposes all REST endpoints (see [API reference](#rest-api-reference))
- Spawns one daemon thread per task via `threading.Thread`
- On startup, launches the GitHub poller thread

**`agent.py`**
- `run_agent(task_id, description)` — full flow from worktree creation to PR
- `continue_agent(task_id, follow_up)` — resumes on the existing branch with prior conversation history
- `_run_loop(...)` — drives the Bedrock `converse` API loop (up to 10 turns), persists messages
- Tools are closures bound to a specific `worktree_path` and `branch_name`
- Guarantees a PR is opened even if the LLM forgets to call `open_pull_request`

**`store.py`**
- Single `tasks.json` file, read/written on every operation (suitable for single-process use)
- `threading.Lock` prevents concurrent write corruption
- Stores full message history per task for conversation continuity

**`github_poller.py`**
- Runs independently of task threads
- Skips tasks with no PR or already in a terminal state (`merged`, `closed`)
- Detects: open → has comments → approved (any APPROVED review) → merged / closed

**`static/index.html`**
- Hash-based routing: `#board` / `#detail-{taskId}`
- Board polls every 10 s; detail view polls every 5 s
- Renders raw Bedrock message history (text blocks, toolUse blocks, toolResult blocks)

---

## APIs used

| Service | How it is used | Auth |
|---|---|---|
| **AWS Bedrock** (`bedrock-runtime`) | Drives the Claude model via the `converse` API | AWS credentials (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` or instance role) |
| **GitHub REST API** (via PyGithub) | Create branches (implicit via push), open PRs, poll PR status and reviews | Personal access token (`GITHUB_TOKEN`) |
| **GitHub CLI (`gh`)** | `start.sh` calls `gh auth token` to refresh the token before launch | `gh auth login` session |

The Bedrock model is selected by the `ANTHROPIC_DEFAULT_SONNET_MODEL` env var (expects an inference profile ARN). Falls back to a hardcoded ARN for `eu-west-1`.

---

## REST API reference

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/tasks` | `{"description": "..."}` | Create and immediately run a task |
| `GET` | `/tasks` | — | List all tasks (sorted by creation date, newest first) |
| `DELETE` | `/tasks` | — | Reset — delete all tasks from the store |
| `GET` | `/tasks/{id}` | — | Get a single task |
| `GET` | `/tasks/{id}/messages` | — | Get full Bedrock conversation history for a task |
| `POST` | `/tasks/{id}/continue` | `{"prompt": "..."}` | Send a follow-up prompt to the agent on the existing branch |
| `POST` | `/tasks/{id}/close` | — | Close a task (sets status `closed`, pr_status `closed`) |
| `POST` | `/tasks/{id}/retry` | — | Re-run a failed task from scratch on a new worktree |

---

## Data schema

### Task object

```jsonc
{
  "id": "a1b2c3d4",           // 8-char random hex
  "description": "...",       // original task prompt
  "status": "pr_open",        // see statuses below
  "branch": "task/a1b2c3d4-add-diagonal-moves",
  "pr_number": 42,
  "pr_url": "https://github.com/org/repo/pull/42",
  "pr_status": "approved",    // see PR statuses below
  "created_at": "2026-03-26T10:00:00+00:00",
  "updated_at": "2026-03-26T10:05:00+00:00",
  "error": null,              // error message string if status=error
  "messages": [ ... ]         // Bedrock converse message history
}
```

### Task statuses

| Status | Meaning |
|---|---|
| `queued` | Created, agent thread not started yet |
| `running` | Agent is actively working |
| `pr_open` | PR created and open |
| `done` | Agent finished but no PR was created |
| `error` | Agent threw an exception (see `error` field) |
| `closed` | Manually closed by user |

### PR statuses

| Status | Meaning |
|---|---|
| `open` | PR is open, no activity |
| `commented` | PR has at least one comment or review comment |
| `approved` | At least one APPROVED review |
| `merged` | PR was merged (terminal) |
| `closed` | PR was closed without merging (terminal) |

### Message object (Bedrock format)

```jsonc
{
  "role": "assistant",   // "user" or "assistant"
  "content": [
    { "text": "..." },                              // plain text block
    { "toolUse": { "name": "...", "input": {} } },  // tool call block
    { "toolResult": { "content": [{ "text": "..." }] } }  // tool result block
  ]
}
```

---

## Security

**GitHub token**
- Stored in `.env` (git-ignored). Never committed.
- `start.sh` refreshes it from the local `gh` CLI session before each launch so the token stays current without manual edits.
- `_github_token()` in `agent.py` refuses to start if the value is empty or the placeholder string `your_*`.

**AWS credentials**
- Resolved via the standard boto3 chain: env vars → `~/.aws/credentials` → instance role.
- No credentials are stored in the codebase.

**Agent sandbox**
- The system prompt restricts the agent to `src/` only — it must not touch `node_modules`, `lib`, or `.git`.
- Each task runs in an isolated temporary directory (`tempfile.mkdtemp`); the main working tree is never modified.
- The agent has no network access beyond what boto3 and PyGithub provide (no shell execution, no arbitrary HTTP).

**API surface**
- The FastAPI server binds to `localhost:8000` by default — not exposed to the network.
- CORS is set to `allow_origins=["*"]` which is fine for local use but should be restricted before any external deployment.
- There is no authentication on the REST API.

**Data at rest**
- `tasks.json` stores conversation history including any code the agent wrote. It is a local file with no encryption.

---

## Setup & run

```bash
# 1. Create virtualenv and install deps
python -m venv .venv
.venv/bin/pip install fastapi uvicorn boto3 PyGithub python-dotenv langchain-core

# 2. Configure environment
cp .env.example .env
# Edit .env:
#   REPO_LOCAL_PATH  — absolute path to the LawnMowerApplication repo
#   GITHUB_REPO      — e.g. your-org/LawnMowerApplication
#   ANTHROPIC_DEFAULT_SONNET_MODEL — Bedrock inference profile ARN
#   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (or use an instance role)
#   GITHUB_TOKEN     — managed automatically by start.sh if gh CLI is configured

# 3. Launch (auto-refreshes GitHub token)
./start.sh
```

Open http://localhost:8000

---

## Limitations

- **Single-process only** — `tasks.json` is read/written on every operation. Running multiple uvicorn workers would cause data corruption.
- **No persistence across restarts** — in-flight tasks (status `running`) are orphaned on restart; their threads are lost.
- **No task cancellation** — there is no way to stop a running agent thread mid-execution.
- **Sequential writes per file** — the `commit_and_push` tool writes one file at a time. Multi-file changes require multiple tool calls and multiple commits.
- **Context window** — the full conversation history is replayed on every `continue_agent` call. Very long conversations will hit the model's context limit.
- **No conflict detection** — concurrent tasks modifying the same file will produce conflicting branches; the second PR will need manual resolution.
- **Token rotation** — `GITHUB_TOKEN` is injected at startup via `start.sh`. If the token expires mid-session, all GitHub operations will fail until the server is restarted.
- **No authentication** — the REST API and dashboard have no login; anyone with network access to port 8000 can create tasks or reset the database.

---

## Future iterations

- **Task queue with worker pool** — replace `threading.Thread` per task with a proper queue (e.g. Celery + Redis) to cap concurrency and survive restarts.
- **Persistent storage** — migrate from `tasks.json` to SQLite or Postgres for multi-worker support and atomic updates.
- **Task cancellation** — expose a `POST /tasks/{id}/cancel` endpoint backed by a cancellation event passed into the agent loop.
- **Multi-file commits** — allow the agent to batch multiple file changes into a single commit using a staging area before pushing.
- **Read tools** — give the agent `read_file` and `list_files` tools so it can explore the codebase before making changes, improving accuracy.
- **PR review bot** — when a PR receives a comment, automatically trigger a `continue_agent` with the comment text as follow-up.
- **Authentication** — add API key or OAuth to the dashboard and REST API before any team/cloud deployment.
- **Streaming** — stream Bedrock responses to the detail view in real time instead of polling.
- **Multiple repos** — parametrize `REPO_LOCAL_PATH` and `GITHUB_REPO` per task to support multi-repo agents from one dashboard.
- **Audit log** — append-only log of all agent actions (files written, commits, PRs) for traceability.
