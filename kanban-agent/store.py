"""Simple JSON-backed task store."""

import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

TASKS_FILE = Path(__file__).parent / "tasks.json"
_lock = threading.Lock()


def _load() -> dict:
    if TASKS_FILE.exists():
        return json.loads(TASKS_FILE.read_text())
    return {}


def _save(data: dict) -> None:
    TASKS_FILE.write_text(json.dumps(data, indent=2))


def create_task(task_id: str, description: str) -> dict:
    task = {
        "id": task_id,
        "description": description,
        "status": "queued",
        "branch": None,
        "pr_number": None,
        "pr_url": None,
        "pr_status": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "error": None,
    }
    with _lock:
        data = _load()
        data[task_id] = task
        _save(data)
    return task


def update_task(task_id: str, **kwargs) -> dict:
    with _lock:
        data = _load()
        task = data[task_id]
        task.update(kwargs)
        task["updated_at"] = datetime.now(timezone.utc).isoformat()
        _save(data)
    return task


def get_task(task_id: str) -> Optional[dict]:
    with _lock:
        return _load().get(task_id)


def list_tasks() -> list[dict]:
    with _lock:
        return list(_load().values())
