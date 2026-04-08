# gstack

This project uses gstack for enhanced Claude Code capabilities.

## Web Browsing

**ALWAYS use `/browse` skill from gstack for all web browsing.** Never use `mcp__claude-in-chrome__*` tools.

## Available gstack Skills

- `/office-hours` — Office hours management
- `/plan-ceo-review` — CEO/leadership plan review
- `/plan-eng-review` — Engineering plan review
- `/plan-design-review` — Design plan review
- `/design-consultation` — Design consultation
- `/design-shotgun` — Rapid design exploration
- `/design-html` — HTML design implementation
- `/review` — Code review
- `/ship` — Ship/deploy
- `/land-and-deploy` — Land and deploy workflow
- `/canary` — Canary deployment
- `/benchmark` — Performance benchmarking
- `/browse` — Web browsing (USE THIS for all web tasks)
- `/connect-chrome` — Connect Chrome browser
- `/qa` — Quality assurance
- `/qa-only` — QA only workflow
- `/design-review` — Design review
- `/setup-browser-cookies` — Setup browser cookies
- `/setup-deploy` — Setup deployment
- `/retro` — Retrospective
- `/investigate` — Investigation
- `/document-release` — Document release
- `/codex` — Codex integration
- `/cso` — CSO workflow
- `/autoplan` — Automatic planning
- `/careful` — Careful mode
- `/freeze` — Freeze state
- `/guard` — Guard mode
- `/unfreeze` — Unfreeze state
- `/gstack-upgrade` — Upgrade gstack
- `/learn` — Learn from codebase

## Git Workflow Rules

1. **Before developing or committing, always rebase to the latest remote main:**
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

2. **Use git worktree for new features, never reuse old branches:**
   ```bash
   git worktree add -b feature/your-feature-name ../feature-worktree
   ```

3. **Always create a PR for code changes, never merge directly to main:**
   - Create a new branch for your feature
   - Commit your changes
   - Push and create a PR
   - Wait for review and approval before merging

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
