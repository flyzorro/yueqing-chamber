#!/bin/bash
set -euo pipefail
cd /Users/zky/code/yueqing-chamber
export PORT=3030
export OPENCLAW_WORKSPACE="${OPENCLAW_WORKSPACE:-/Users/zky/.openclaw/workspace}"
exec node scripts/agent-board-server.cjs
