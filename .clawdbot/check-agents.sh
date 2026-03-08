#!/bin/bash
# check-agents.sh - Monitor all active coding agents
# Runs every 10 minutes via cron

set -e

TASKS_FILE="$HOME/.openclaw/workspace/.clawdbot/active-tasks.json"
LOG_FILE="$HOME/.openclaw/workspace/.clawdbot/monitor.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if tasks file exists
if [[ ! -f "$TASKS_FILE" ]]; then
  log "No tasks file found"
  exit 0
fi

# Parse tasks
task_count=$(jq '.tasks | length' "$TASKS_FILE" 2>/dev/null || echo "0")
if [[ "$task_count" == "0" ]]; then
  log "No active tasks"
  exit 0
fi

log "Checking $task_count active tasks..."

# Read tasks as JSON array
tasks_json=$(cat "$TASKS_FILE")

# Iterate through tasks using jq
for row in $(echo "$tasks_json" | jq -r '.tasks[] | @base64'); do
  task=$(echo "$row" | base64 -D)
  
  id=$(echo "$task" | jq -r '.id')
  tmux_session=$(echo "$task" | jq -r '.tmuxSession')
  branch=$(echo "$task" | jq -r '.branch')
  worktree=$(echo "$task" | jq -r '.worktree')
  status=$(echo "$task" | jq -r '.status')
  attempts=$(echo "$task" | jq -r '.attempts // 0')
  
  log "Task: $id (status: $status)"
  
  # Skip non-running tasks
  if [[ "$status" != "running" ]]; then
    continue
  fi
  
  # 1. Check if tmux session is alive (optional - agent might complete without tmux)
  if [[ -n "$tmux_session" ]] && tmux has-session -t "$tmux_session" 2>/dev/null; then
    log "  tmux session active: $tmux_session"
  fi
  
  # 2. Check if worktree has uncommitted changes
  if [[ -d "$worktree" ]]; then
    cd "$worktree"
    changes=$(git status --porcelain 2>/dev/null | head -5)
    if [[ -n "$changes" ]]; then
      log "  uncommitted changes in $worktree"
    fi
  fi
  
  # 3. Check for open PR on this branch (requires gh auth)
  if gh auth status &>/dev/null; then
    pr_info=$(gh pr list --head "$branch" --json number,state,mergeable,statusCheckRollup 2>/dev/null || echo "[]")
    pr_number=$(echo "$pr_info" | jq -r '.[0].number // empty')
    
    if [[ -n "$pr_number" ]]; then
      pr_state=$(echo "$pr_info" | jq -r '.[0].state')
      mergeable=$(echo "$pr_info" | jq -r '.[0].mergeable')
      ci_status=$(echo "$pr_info" | jq -r '.[0].statusCheckRollup // []')
      
      log "  PR #$pr_number found (state: $pr_state, mergeable: $mergeable)"
      
      # Check if PR is ready
      if [[ "$pr_state" == "OPEN" && "$mergeable" == "MERGEABLE" ]]; then
        # Check CI status
        ci_passed=$(echo "$ci_status" | jq '[.[] | select(.conclusion == "SUCCESS" or .status == "COMPLETED")] | length')
        ci_total=$(echo "$ci_status" | jq 'length')
        
        if [[ "$ci_total" -gt 0 && "$ci_passed" -eq "$ci_total" ]]; then
          log "  ✅ PR #$pr_number ready for review!"
          
          # Update task status
          jq --arg id "$id" --arg pr "$pr_number" '
            (.tasks[] | select(.id == $id)) |= . + {
              "status": "ready_for_review",
              "pr": ($pr | tonumber),
              "checks": {"prCreated": true, "ciPassed": true},
              "readyAt": (now | todate)
            }
          ' "$TASKS_FILE" > /tmp/tasks.tmp && mv /tmp/tasks.tmp "$TASKS_FILE"
          
          # TODO: Send notification
        else
          log "  CI status: $ci_passed/$ci_total checks passed"
        fi
      fi
    fi
  fi
done

log "Check complete"