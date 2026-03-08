#!/bin/bash
# spawn-agent.sh - Spawn a coding agent with worktree isolation
# Usage: spawn-agent.sh <task-id> <repo-path> <branch-name> <prompt>
#
# This spawns a qwen agent via OpenClaw sessions_spawn API

set -e

TASK_ID="$1"
REPO_PATH="$2"
BRANCH_NAME="$3"
PROMPT="$4"

if [[ -z "$TASK_ID" || -z "$REPO_PATH" || -z "$BRANCH_NAME" || -z "$PROMPT" ]]; then
  echo "Usage: spawn-agent.sh <task-id> <repo-path> <branch-name> <prompt>"
  echo ""
  echo "Example:"
  echo "  spawn-agent.sh feat-templates ~/code/myapp feat/templates 'Add template system'"
  exit 1
fi

WORKTREE_PATH="$REPO_PATH-worktrees/$TASK_ID"
TMUX_SESSION="agent-$TASK_ID"
TIMESTAMP=$(date +%s)

echo "🚀 Setting up agent for: $PROMPT"
echo ""

# Step 1: Create worktree
echo "📦 Creating worktree..."
cd "$REPO_PATH"
git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" origin/main 2>/dev/null || {
  echo "Branch might already exist, trying existing branch..."
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME" 2>/dev/null || {
    echo "❌ Failed to create worktree"
    exit 1
  }
}
echo "   ✓ Worktree: $WORKTREE_PATH"

# Step 2: Install dependencies
if [[ -f "$WORKTREE_PATH/package.json" ]]; then
  echo "📥 Installing dependencies..."
  cd "$WORKTREE_PATH"
  pnpm install 2>/dev/null || npm install 2>/dev/null || echo "   ⚠ No lockfile found, skipping"
fi

# Step 3: Register task
TASKS_FILE="$HOME/.openclaw/workspace/.clawdbot/active-tasks.json"
jq --arg id "$TASK_ID" --arg session "$TMUX_SESSION" \
   --arg branch "$BRANCH_NAME" --arg worktree "$WORKTREE_PATH" \
   --arg timestamp "$TIMESTAMP" --arg desc "$PROMPT" '
  .tasks += [{
    "id": $id,
    "tmuxSession": $session,
    "agent": "qwen",
    "description": $desc,
    "branch": $branch,
    "worktree": $worktree,
    "startedAt": ($timestamp | tonumber),
    "status": "running",
    "attempts": 0
  }]
' "$TASKS_FILE" > /tmp/tasks.tmp && mv /tmp/tasks.tmp "$TASKS_FILE"
echo "   ✓ Task registered"

# Step 4: Create tmux session with full context
tmux new-session -d -s "$TMUX_SESSION" -c "$WORKTREE_PATH"

# Write a context file for the agent
cat > "$WORKTREE_PATH/.agent-context.md" << EOF
# Agent Task Context

## Task
$PROMPT

## Environment
- Worktree: $WORKTREE_PATH
- Branch: $BRANCH_NAME
- Task ID: $TASK_ID

## Instructions
1. Implement the requested feature/fix
2. Write tests if applicable
3. Run lint and tests before committing
4. Create a PR with: \`gh pr create --fill\`
5. Include screenshots if UI changes

## Definition of Done
- [ ] PR created
- [ ] Branch synced to main (no merge conflicts)
- [ ] CI passing (lint, types, tests)
- [ ] Code reviewed
- [ ] Screenshots included (if UI changes)
EOF

echo ""
echo "✅ Agent environment ready!"
echo ""
echo "📍 Next steps:"
echo "   1. OpenClaw will spawn qwen agent to work on this task"
echo "   2. Monitor: tail -f ~/.openclaw/workspace/.clawdbot/monitor.log"
echo "   3. Attach: tmux attach -t $TMUX_SESSION"
echo "   4. Steer: tmux send-keys -t $TMUX_SESSION 'your message' Enter"
echo ""
echo "To spawn the qwen agent, run:"
echo "  openclaw agent spawn --task '$PROMPT' --cwd $WORKTREE_PATH"