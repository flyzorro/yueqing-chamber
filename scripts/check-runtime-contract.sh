#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "[runtime-contract] $*" >&2
  exit 1
}

pass() {
  echo "[runtime-contract] $*"
}

if [[ -e dashboard/index.html ]]; then
  fail "dashboard/index.html should not exist in the current runtime boundary"
fi
pass "dashboard asset removed from repo runtime boundary"

if [[ ! -f mobile/.env.example ]]; then
  fail "mobile/.env.example is required"
fi
pass "mobile/.env.example exists"

if ! grep -q 'EXPO_PUBLIC_API_BASE_URL=' mobile/.env.example; then
  fail "mobile/.env.example must define EXPO_PUBLIC_API_BASE_URL"
fi
pass "mobile/.env.example documents EXPO_PUBLIC_API_BASE_URL"

if ! grep -q 'process.env.EXPO_PUBLIC_API_BASE_URL' mobile/app/utils/api.ts; then
  fail "mobile/app/utils/api.ts must read EXPO_PUBLIC_API_BASE_URL from environment"
fi
pass "mobile/app/utils/api.ts uses EXPO_PUBLIC_API_BASE_URL"

if grep -Eq "dashboardPath|express\.static\(|sendFile\(" server/src/index.ts; then
  fail "server/src/index.ts should not serve historical dashboard assets"
fi
pass "server/src/index.ts no longer serves dashboard assets"

if ! grep -q "Use /api, /api/docs, or /health\." server/src/index.ts; then
  fail "server root route contract message is missing"
fi
pass "server root route contract message present"

echo "[runtime-contract] OK"