#!/bin/bash
# quick-test.sh - Quick test of the agent swarm system
# Creates a simple feature task and spawns an agent

set -e

REPO_PATH="$HOME/code/clawdbot-test"
TASK_ID="test-hello-$(date +%s)"
BRANCH="test/hello-world"
PROMPT="Create a simple hello.txt file with 'Hello from Qwen Agent!' content"

echo "🧪 Quick Test: Agent Swarm"
echo "=========================="
echo ""

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
  echo "❌ GitHub CLI not authenticated. Run: gh auth login"
  exit 1
fi

# Check if repo has remote
cd "$REPO_PATH"
if ! git remote | grep -q origin; then
  echo "📡 Creating GitHub repo..."
  gh repo create clawdbot-test --public --source=. --push
  echo "   ✓ Created: https://github.com/flyzorro/clawdbot-test"
fi

# Run spawn-agent.sh
echo ""
echo "🚀 Spawning agent..."
"$HOME/.openclaw/workspace/.clawdbot/spawn-agent.sh" "$TASK_ID" "$REPO_PATH" "$BRANCH" "$PROMPT"

echo ""
echo "✅ Test complete! Check status:"
echo "   tail -f ~/.openclaw/workspace/.clawdbot/monitor.log"
echo ""
echo "Active tasks:"
cat "$HOME/.openclaw/workspace/.clawdbot/active-tasks.json" | jq '.tasks[]'