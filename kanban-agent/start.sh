#!/bin/bash
set -e
cd "$(dirname "$0")"

# Refresh GitHub token from gh CLI before starting
TOKEN=$(gh auth token 2>/dev/null)
if [ -n "$TOKEN" ]; then
  if grep -q "^GITHUB_TOKEN=" .env 2>/dev/null; then
    sed -i '' "s|^GITHUB_TOKEN=.*|GITHUB_TOKEN=${TOKEN}|" .env
  else
    echo "GITHUB_TOKEN=${TOKEN}" >> .env
  fi
fi

.venv/bin/uvicorn main:app --reload --port 8000
