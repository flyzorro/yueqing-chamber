#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-/Users/zky/code/yueqing-chamber}"
TEAM="${TEAM:-}"
REGISTRY="$REPO/.clawdbot/active-tasks.json"

cd "$REPO"

if [[ ! -f "$REGISTRY" ]]; then
  mkdir -p "$(dirname "$REGISTRY")"
  cat > "$REGISTRY" <<'JSON'
{
  "version": 1,
  "repo": "flyzorro/yueqing-chamber",
  "updatedAt": null,
  "tasks": []
}
JSON
fi

python3 - "$REPO" "$REGISTRY" "$TEAM" <<'PY'
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

repo = Path(sys.argv[1])
registry = Path(sys.argv[2])
team = sys.argv[3]
data = json.loads(registry.read_text())
tasks = data.get('tasks', [])


def run(cmd):
    p = subprocess.run(cmd, cwd=repo, text=True, capture_output=True)
    return p.returncode, p.stdout.strip(), p.stderr.strip()

out = {
    'repo': str(repo),
    'team': team or None,
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'alerts': [],
    'tasks': [],
}

for task in tasks:
    item = {
        'id': task.get('id'),
        'agent': task.get('agent'),
        'status': task.get('status'),
        'tmuxSession': task.get('tmuxSession'),
        'branch': task.get('branch'),
        'pr': None,
        'checks': None,
        'alerts': [],
    }

    tmux_session = task.get('tmuxSession')
    if tmux_session:
        rc, so, se = run(['tmux', 'has-session', '-t', tmux_session])
        item['tmuxAlive'] = rc == 0
        if task.get('status') == 'running' and rc != 0:
            item['alerts'].append('tmux session missing while task marked running')
    else:
        item['tmuxAlive'] = None
        item['alerts'].append('missing tmuxSession in registry')

    branch = task.get('branch')
    if branch:
        rc, so, se = run([
            'gh', 'pr', 'list',
            '--head', branch,
            '--state', 'all',
            '--json', 'number,state,title,url',
            '--limit', '1'
        ])
        if rc == 0 and so:
            try:
                prs = json.loads(so)
            except json.JSONDecodeError:
                prs = []
            if prs:
                pr = prs[0]
                item['pr'] = pr
                rc2, so2, se2 = run(['gh', 'pr', 'checks', str(pr['number'])])
                item['checks'] = so2 if rc2 == 0 else se2
                if rc2 != 0:
                    item['alerts'].append('failed to read PR checks')
        elif rc != 0:
            item['alerts'].append('failed to query PR by branch')
    else:
        item['alerts'].append('missing branch in registry')

    if task.get('notifyOnComplete') and item.get('pr') and task.get('status') in ('running', 'review'):
        if item.get('checks') and 'fail' in item['checks'].lower():
            item['alerts'].append('PR checks failing')

    if item['alerts']:
        out['alerts'].append({'id': item['id'], 'alerts': item['alerts']})
    out['tasks'].append(item)

print(json.dumps(out, ensure_ascii=False, indent=2))
PY
