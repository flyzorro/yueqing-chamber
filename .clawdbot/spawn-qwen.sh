#!/bin/bash
# spawn-qwen.sh - Spawn a Qwen coding agent via OpenClaw
# This is the main entry point for spawning coding tasks

set -e

TASK_ID="$1"
REPO_PATH="$2"
BRANCH_NAME="$3"
PROMPT="$4"

if [[ -z "$TASK_ID" || -z "$REPO_PATH" || -z "$BRANCH_NAME" || -z "$PROMPT" ]]; then
  echo "Usage: spawn-qwen.sh <task-id> <repo-path> <branch-name> <prompt>"
  echo ""
  echo "Example:"
  echo "  spawn-qwen.sh feat-hello ~/code/clawdbot-test feat/hello 'Create hello.txt'"
  exit 1
fi

WORKTREE_PATH="$REPO_PATH-worktrees/$TASK_ID"
TMUX_SESSION="agent-$TASK_ID"
TIMESTAMP=$(date +%s)

echo "🦞 Spawning Qwen Agent"
echo "======================="
echo ""

# Step 1: Create worktree
echo "📦 Creating worktree..."
cd "$REPO_PATH"
git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" origin/main 2>/dev/null || {
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME" 2>/dev/null || {
    echo "❌ Failed to create worktree"
    exit 1
  }
}
echo "   ✓ $WORKTREE_PATH"

# Step 2: Install deps
if [[ -f "$WORKTREE_PATH/package.json" ]]; then
  echo "📥 Installing dependencies..."
  cd "$WORKTREE_PATH" && pnpm install 2>/dev/null || npm install 2>/dev/null
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

# Step 4: Create tmux session
tmux new-session -d -s "$TMUX_SESSION" -c "$WORKTREE_PATH"

# Step 5: Create agent context file
cat > "$WORKTREE_PATH/.agent-task.md" << EOF
# Coding Task

## Objective
$PROMPT

## Environment
- Worktree: \`$WORKTREE_PATH\`
- Branch: \`$BRANCH_NAME\`
- Task ID: $TASK_ID

## Steps
1. Understand the codebase structure
2. Implement the requested feature/fix
3. Write/update tests if applicable
4. Run: \`pnpm lint && pnpm test\` (or npm equivalent)
5. Commit with clear message
6. Create PR: \`gh pr create --fill\`

## Definition of Done
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Lint passing
- [ ] PR created
- [ ] CI green
EOF

echo "   ✓ Context file created"

# Step 6: Trigger OpenClaw to spawn a sub-agent for this task
# The sub-agent will work on this task with the worktree as cwd
echo ""
echo "🚀 Spawning Qwen sub-agent..."

# Use openclaw agent command to trigger a coding session
# This sends a message to trigger agent work
openclaw agent --local --message "Please work on this coding task in $WORKTREE_PATH:

$PROMPT

The task context is in .agent-task.md file. Read it first, then implement the solution. When done, commit and create a PR with gh pr create --fill." 2>&1 | head -50

echo ""
echo "✅ Agent spawned!"
echo ""
echo "📍 Monitor: tail -f ~/.openclaw/workspace/.clawdbot/monitor.log"
echo "📍 Attach: tmux attach -t $TMUX_SESSION"
echo "📍 Tasks: cat ~/.openclaw/workspace/.clawdbot/active-tasks.json | jq ."