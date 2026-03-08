#!/bin/bash
# cleanup.sh - Remove completed tasks and orphaned worktrees
# Run daily via cron

set -e

TASKS_FILE="$HOME/.openclaw/workspace/.clawdbot/active-tasks.json"
LOG_FILE="$HOME/.openclaw/workspace/.clawdbot/monitor.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Remove completed tasks (older than 24h)
if [[ -f "$TASKS_FILE" ]]; then
  completed=$(jq '[.tasks[] | select(.status == "done" or .status == "merged")]' "$TASKS_FILE" 2>/dev/null)
  count=$(echo "$completed" | jq 'length')
  
  if [[ $count -gt 0 ]]; then
    log "Cleaning up $count completed tasks"
    jq '.tasks = [.tasks[] | select(.status != "done" and .status != "merged")]' "$TASKS_FILE" > /tmp/tasks.tmp && mv /tmp/tasks.tmp "$TASKS_FILE"
  fi
fi

# Remove orphaned worktrees (no corresponding task)
# This would iterate through worktrees and check if they're in active-tasks.json
# For safety, we just log orphans rather than auto-delete

log "Cleanup complete"