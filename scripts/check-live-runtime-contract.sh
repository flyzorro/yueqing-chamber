#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="${1:-${LIVE_RUNTIME_BASE_URL:-https://yueqing-chamber-production.up.railway.app}}"
API_DOCS_URL="$BASE_URL/api/docs"
HEALTH_URL="$BASE_URL/health"
ROOT_URL="$BASE_URL/"

fail() {
  echo "[live-runtime-contract] $*" >&2
  exit 1
}

pass() {
  echo "[live-runtime-contract] $*"
}

fetch_headers() {
  curl -fsSIL "$1"
}

fetch_body() {
  curl -fsS "$1"
}

health_body="$(fetch_body "$HEALTH_URL")" || fail "health endpoint request failed: $HEALTH_URL"
printf '%s' "$health_body" | grep -q '"status"[[:space:]]*:[[:space:]]*"ok"' || fail "health payload must contain status=ok"
pass "health endpoint returns status=ok"

api_docs_headers="$(fetch_headers "$API_DOCS_URL")" || fail "api docs request failed: $API_DOCS_URL"
printf '%s' "$api_docs_headers" | grep -Eq '^HTTP/.* (200|301|302)' || fail "/api/docs must be reachable (200/301/302)"
pass "/api/docs is reachable"

root_body="$(curl -sS "$ROOT_URL")" || true
printf '%s' "$root_body" | grep -q 'Use /api, /api/docs, or /health\.' || fail "root route contract message is missing"
pass "root route contract message present"

echo "[live-runtime-contract] OK ($BASE_URL)"
