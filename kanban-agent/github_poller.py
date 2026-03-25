"""Background thread that polls GitHub PR status for all active tasks."""

import os
import threading
import time

from dotenv import load_dotenv
from github import Github

import store

load_dotenv()

_repo = None


def _get_repo():
    global _repo
    if _repo is None:
        gh = Github(os.environ["GITHUB_TOKEN"])
        _repo = gh.get_repo(os.environ["GITHUB_REPO"])
    return _repo

# PR states we consider "terminal" (stop polling)
TERMINAL = {"merged", "closed"}


def _pr_status(pr_number: int) -> dict:
    """Return a dict with pr_status, pr_url, and merged flag."""
    pr = _get_repo().get_pull(pr_number)

    if pr.merged:
        return {"pr_status": "merged", "pr_url": pr.html_url}

    if pr.state == "closed":
        return {"pr_status": "closed", "pr_url": pr.html_url}

    # Check reviews
    reviews = list(pr.get_reviews())
    approved = any(r.state == "APPROVED" for r in reviews)
    if approved:
        return {"pr_status": "approved", "pr_url": pr.html_url}

    # Check comments (review comments + issue comments)
    has_comments = (
        pr.comments > 0
        or pr.review_comments > 0
    )
    if has_comments:
        return {"pr_status": "commented", "pr_url": pr.html_url}

    return {"pr_status": "open", "pr_url": pr.html_url}


def _poll_once():
    tasks = store.list_tasks()
    for task in tasks:
        if task["pr_number"] is None:
            continue
        if task.get("pr_status") in TERMINAL:
            continue
        try:
            updates = _pr_status(task["pr_number"])
            store.update_task(task["id"], **updates)
        except Exception as e:
            print(f"[poller] error polling PR {task['pr_number']}: {e}")


def start_poller(interval_seconds: int = 30):
    def loop():
        while True:
            try:
                _poll_once()
            except Exception as e:
                print(f"[poller] unexpected error: {e}")
            time.sleep(interval_seconds)

    t = threading.Thread(target=loop, daemon=True)
    t.start()
