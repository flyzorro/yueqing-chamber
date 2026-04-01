#!/usr/bin/env python3
import argparse
import json
import time
from pathlib import Path

DEFAULT = Path('/Users/zky/code/yueqing-chamber/.clawdbot/active-tasks.json')


def load(path: Path):
    if not path.exists():
        return {"version": 1, "repo": "flyzorro/yueqing-chamber", "updatedAt": None, "tasks": []}
    return json.loads(path.read_text())


def save(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    data['updatedAt'] = int(time.time() * 1000)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', default=str(DEFAULT))
    sub = parser.add_subparsers(dest='cmd', required=True)

    add = sub.add_parser('add')
    add.add_argument('--id', required=True)
    add.add_argument('--tmux-session', required=True)
    add.add_argument('--agent', required=True)
    add.add_argument('--description', required=True)
    add.add_argument('--repo', required=True)
    add.add_argument('--worktree', required=True)
    add.add_argument('--branch', required=True)
    add.add_argument('--status', default='running')
    add.add_argument('--notify-on-complete', action='store_true')

    done = sub.add_parser('complete')
    done.add_argument('--id', required=True)
    done.add_argument('--pr', type=int)
    done.add_argument('--note', default='')

    upd = sub.add_parser('status')
    upd.add_argument('--id', required=True)
    upd.add_argument('--value', required=True)

    ls = sub.add_parser('list')

    args = parser.parse_args()
    path = Path(args.file)
    data = load(path)
    tasks = data.setdefault('tasks', [])

    if args.cmd == 'add':
        tasks[:] = [t for t in tasks if t.get('id') != args.id]
        tasks.append({
            'id': args.id,
            'tmuxSession': args.tmux_session,
            'agent': args.agent,
            'description': args.description,
            'repo': args.repo,
            'worktree': args.worktree,
            'branch': args.branch,
            'startedAt': int(time.time() * 1000),
            'status': args.status,
            'notifyOnComplete': bool(args.notify_on_complete),
        })
        save(path, data)
    elif args.cmd == 'complete':
        for t in tasks:
            if t.get('id') == args.id:
                t['status'] = 'done'
                t['completedAt'] = int(time.time() * 1000)
                if args.pr:
                    t['pr'] = args.pr
                if args.note:
                    t['note'] = args.note
                break
        save(path, data)
    elif args.cmd == 'status':
        for t in tasks:
            if t.get('id') == args.id:
                t['status'] = args.value
                break
        save(path, data)
    elif args.cmd == 'list':
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
