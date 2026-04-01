#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/bin:$HOME/Library/Python/3.14/bin:$PATH"

REPO="${REPO:-/Users/zky/code/yueqing-chamber}"
TEAM="${TEAM:-yc-rd-$(date +%Y%m%d-%H%M%S)}"
LEADER="${LEADER:-leader}"

if ! command -v clawteam >/dev/null 2>&1; then
  echo "clawteam not found in PATH" >&2
  exit 1
fi

cd "$REPO"

echo "Creating team: $TEAM"
clawteam team spawn-team "$TEAM" -d "Yueqing Chamber R&D workflow" -n "$LEADER"

clawteam spawn tmux openclaw --team "$TEAM" --repo "$REPO" --agent-name dev1 --task "Role: Developer 1 for Yueqing Chamber. Work only in your isolated worktree. Implement core backend/frontend changes, report progress clearly, and stop when blocked."
clawteam spawn tmux openclaw --team "$TEAM" --repo "$REPO" --agent-name dev2 --task "Role: Developer 2 for Yueqing Chamber. Handle supporting implementation, integration work, fixes, and code cleanup. Work only in your isolated worktree and report progress clearly."
clawteam spawn tmux openclaw --team "$TEAM" --repo "$REPO" --agent-name qa1 --task "Role: QA 1 for Yueqing Chamber. Run server/mobile verification, capture reproducible failures, and report exact commands and outcomes."
clawteam spawn tmux openclaw --team "$TEAM" --repo "$REPO" --agent-name qa2 --task "Role: QA 2 for Yueqing Chamber. Focus on regression, edge cases, and E2E verification. Report failures with concise repro steps."
clawteam spawn tmux openclaw --team "$TEAM" --repo "$REPO" --agent-name config1 --task "Role: Config engineer for Yueqing Chamber. Own environment setup, CI, scripts, secrets handling boundaries, and integration stability. Do not use production write access."

echo
clawteam team status "$TEAM"
echo
echo "Next:"
echo "  clawteam board show $TEAM"
echo "  tmux attach -t clawteam-$TEAM"
echo "  TEAM=$TEAM bash .clawdbot/check-agents.sh"
