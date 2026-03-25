# Vibe Kanban — AI Agent Dashboard

A LangChain-powered task runner + kanban dashboard for the LawnMowerApplication repo.

## What it does

1. You type a task description in the dashboard and hit **Run Agent**.
2. A LangChain agent (backed by Claude) creates a git branch, implements the change, pushes it, and opens a GitHub PR.
3. The dashboard polls PR status every 10 s (client) / 30 s (server) and moves the card through columns:
   **Queued → Running → PR Open → Commented → Approved → Merged**

## Setup

```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and GITHUB_TOKEN
```

## Run

```bash
.venv/bin/uvicorn main:app --reload --port 8000
```

Then open http://localhost:8000

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/tasks` | Create & run a task `{"description": "..."}` |
| `GET`  | `/tasks` | List all tasks |
| `GET`  | `/tasks/{id}` | Get a single task |

## Architecture

```
main.py            FastAPI app, task lifecycle, background thread per task
agent.py           LangChain agent with 3 tools: create_branch, commit_and_push, open_pull_request
store.py           JSON-backed task store (tasks.json)
github_poller.py   Background thread polling GitHub PR status every 30s
static/index.html  Kanban dashboard (vanilla JS, no build step)
```
