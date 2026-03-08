#!/bin/bash
# spawn-task.sh - Spawn a Qwen coding agent task
# Usage: spawn-task.sh <repo-path> <branch-name> <prompt>
#
# This creates a worktree and spawns an OpenClaw sub-agent to work on the task

set -e

REPO_PATH="${1:-.}"
BRANCH_NAME="$2"
PROMPT="$3"

if [[ -z "$BRANCH_NAME" || -z "$PROMPT" ]]; then
  echo "Usage: spawn-task.sh <repo-path> <branch-name> <prompt>"
  echo ""
  echo "Example:"
  echo "  spawn-task.sh ~/code/myapp feat/hello 'Create hello.txt file'"
  exit 1
fi

# Resolve absolute path
REPO_PATH="$(cd "$REPO_PATH" && pwd)"
TASK_ID="$(echo "$BRANCH_NAME" | tr '/' '-')-$(date +%s)"
WORKTREE_PATH="$REPO_PATH-worktrees/$TASK_ID"
TMUX_SESSION="agent-$TASK_ID"
TIMESTAMP=$(date +%s)

echo "🦞 Spawning Coding Agent"
echo "========================="
echo ""

# Step 1: Ensure remote exists
cd "$REPO_PATH"
if ! git remote | grep -q origin; then
  if gh auth status &>/dev/null; then
    REPO_NAME="$(basename "$REPO_PATH")"
    echo "📡 Creating GitHub repo: flyzorro/$REPO_NAME"
    gh repo create "$REPO_NAME" --public --source=. --push 2>/dev/null || true
  else
    echo "⚠ No remote 'origin'. Run: gh auth login && git remote add origin <url>"
  fi
fi

# Step 2: Create worktree
echo "📦 Creating worktree..."
git fetch origin 2>/dev/null || true
git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" origin/main 2>/dev/null || {
  git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" 2>/dev/null || {
    echo "❌ Failed to create worktree"
    exit 1
  }
}
echo "   ✓ $WORKTREE_PATH"

# Step 3: Install deps
if [[ -f "$WORKTREE_PATH/package.json" ]]; then
  echo "📥 Installing dependencies..."
  cd "$WORKTREE_PATH"
  pnpm install 2>/dev/null || npm install 2>/dev/null || true
fi

# Step 4: Register task
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
echo "   ✓ Task registered: $TASK_ID"

# Step 5: Create context file
cat > "$WORKTREE_PATH/.agent-task.md" << EOF
# Coding Task

## Objective
$PROMPT

## Environment
- Worktree: \`$WORKTREE_PATH\`
- Branch: \`$BRANCH_NAME\`
- Task ID: $TASK_ID

## Instructions
1. Read the codebase structure first
2. Implement the requested feature/fix
3. Write/update tests if applicable
4. Run lint and tests before committing
5. Commit with a clear message
6. Create PR: \`gh pr create --fill\`
7. If UI changes, include screenshots in PR description

## Definition of Done
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Lint passing
- [ ] PR created with description
- [ ] CI green
EOF

# Step 6: Create tmux session for monitoring
tmux new-session -d -s "$TMUX_SESSION" -c "$WORKTREE_PATH" 2>/dev/null || true

echo ""
echo "✅ Worktree ready!"
echo ""
echo "📍 Task ID: $TASK_ID"
echo "📍 Worktree: $WORKTREE_PATH"
echo "📍 Branch: $BRANCH_NAME"
echo ""
echo "Now spawning Qwen agent via OpenClaw..."
echo ""

# Step 7: Spawn OpenClaw sub-agent
# This is a placeholder - in production, OpenClaw main session would do this
echo "Run this in OpenClaw chat to spawn the agent:"
echo ""
echo '---'
echo "请在 $WORKTREE_PATH 目录下完成以下任务："
echo ""
echo "$PROMPT"
echo ""
echo "任务上下文在 .agent-task.md 文件中。完成后请 commit 并创建 PR。"
echo '---'