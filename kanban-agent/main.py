"""FastAPI backend for the Mad-bot - MultiTask Agent agent."""

import threading
import uuid
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import store
from github_poller import start_poller

load_dotenv()

app = FastAPI(title="Mad-bot - MultiTask Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateTaskRequest(BaseModel):
    description: str
    task_id: Optional[str] = None


def _run_agent_async(task_id: str, description: str):
    """Run the agent in a background thread and update task state."""
    import agent  # imported here to avoid circular issues at startup

    store.update_task(task_id, status="running")
    try:
        result = agent.run_agent(task_id, description)
        branch = result.get("branch")
        pr_number = result.get("pr_number")
        pr_url = result.get("pr_url")
        store.update_task(
            task_id,
            status="pr_open" if pr_number else "done",
            branch=branch,
            pr_number=pr_number,
            pr_url=pr_url,
            pr_status="open" if pr_number else None,
        )
    except Exception as e:
        store.update_task(task_id, status="error", error=str(e))


@app.on_event("startup")
def on_startup():
    start_poller(interval_seconds=30)


@app.post("/tasks", status_code=201)
def create_task(req: CreateTaskRequest):
    task_id = req.task_id or str(uuid.uuid4())[:8]
    task = store.create_task(task_id, req.description)
    threading.Thread(
        target=_run_agent_async,
        args=(task_id, req.description),
        daemon=True,
    ).start()
    return task


@app.get("/tasks")
def list_tasks():
    tasks = store.list_tasks()
    tasks.sort(key=lambda t: t["created_at"], reverse=True)
    return tasks


@app.delete("/tasks")
def reset_tasks():
    store.reset()
    return {"ok": True}


@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks/{task_id}/close")
def close_task(task_id: str):
    task = store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] in ("running", "queued"):
        raise HTTPException(status_code=400, detail="Cannot close a running or queued task")
    store.update_task(task_id, status="closed", pr_status="closed")
    return store.get_task(task_id)


@app.post("/tasks/{task_id}/retry")
def retry_task(task_id: str):
    task = store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "error":
        raise HTTPException(status_code=400, detail="Only failed tasks can be retried")
    store.update_task(task_id, status="queued", error=None, branch=None, pr_number=None, pr_url=None, pr_status=None)
    threading.Thread(
        target=_run_agent_async,
        args=(task_id, task["description"]),
        daemon=True,
    ).start()
    return store.get_task(task_id)


# Serve the dashboard
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def dashboard():
    return FileResponse("static/index.html")
