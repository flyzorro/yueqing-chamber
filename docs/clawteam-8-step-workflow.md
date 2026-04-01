# Yueqing Chamber — ClawTeam 8-step Workflow

Repo: `/Users/zky/code/yueqing-chamber`
GitHub: `https://github.com/flyzorro/yueqing-chamber`

## Team shape
- `leader` — 人类/主控（Zoe 角色）
- `dev1`, `dev2` — 研发
- `qa1`, `qa2` — 测试
- `config1` — 配置/CI/环境工程师

## Step 1 — Customer Request → Scoping with Zoe
这一步不要交给子 agent 乱做。`leader` 负责：
- 把客户诉求整理成一个明确 feature brief
- 明确验收标准 / 非目标 / 风险
- 如需管理员 API、生产只读 DB、手工补 credits，这些都只允许人或主控执行，不下放给 dev/qa agent

建议输出到任务 prompt 的固定结构：
- 背景
- 用户价值
- 约束
- 验收标准
- repo / base branch / target branch naming
- 是否允许改 schema / API / UI
- 是否要求截图

## Step 2 — Spawn the Agent Team
用仓库根目录下脚本起团队：

```bash
cd /Users/zky/code/yueqing-chamber
bash scripts/start-rd-team.sh
```

它会：
- 创建一个 ClawTeam team
- 生成 2 个 dev + 2 个 qa + 1 个 config agent
- 每个 agent 使用独立 git worktree + tmux window

## Step 3 — Monitoring Loop
任务注册表：`.clawdbot/active-tasks.json`
巡检脚本：`.clawdbot/check-agents.sh`

```bash
cd /Users/zky/code/yueqing-chamber
bash .clawdbot/check-agents.sh
```

建议每 10 分钟跑一次：

```cron
*/10 * * * * cd /Users/zky/code/yueqing-chamber && bash .clawdbot/check-agents.sh >> /tmp/yc-clawteam-check.log 2>&1
```

巡检内容：
- tmux session 是否还活着
- 对应分支是否已有 PR
- PR checks 是否通过 / 失败 / 仍在跑
- 哪些任务需要人工介入

## Step 4 — Agent Creates PR
Definition of done 不是“开了 PR”，而是：
- PR 已创建
- 分支和 `main` 无冲突
- 必要 checks 通过
- 如果有 UI 变更，PR 描述必须附 screenshot

建议 PR 标题前缀：
- `feat:`
- `fix:`
- `chore:`
- `test:`

## Step 5 — Automated Code Review
这个仓库先按“接口留好，审查器逐步接入”处理。

推荐 reviewer 位：
- `codex-reviewer`
- `gemini-reviewer`
- `claude-reviewer`

当前最小可落地标准：
- 先让 reviewer comment / summary 输出统一写回 PR 评论或任务注记
- critical 问题阻塞 merge
- 一般建议不阻塞

## Step 6 — Automated Testing
该仓库当前可直接接入的检查：

### Server
```bash
cd server
npm run lint
npm test
npm run build
```

### Mobile
```bash
cd mobile
npm run typecheck
```

### E2E
```bash
cd /Users/zky/code/yueqing-chamber
npm run test:e2e
```

UI 变更规则：
- 必须附截图到 PR 描述或 docs 目录

## Step 7 — Human Review
只在以下条件都满足时再通知人看：
- PR 已创建
- checks 通过
- reviewer 没有 critical blocker
- UI 变更已有截图

## Step 8 — Merge + Cleanup
merge 后做两件事：
- 清理 worktree / tmux / registry
- 更新 `.clawdbot/active-tasks.json`

## Task registry example
```json
{
  "version": 1,
  "repo": "flyzorro/yueqing-chamber",
  "tasks": [
    {
      "id": "feature-company-directory",
      "tmuxSession": "clawteam-yc-rd-20260321-100000",
      "agent": "dev1",
      "description": "Build independent company directory module",
      "repo": "flyzorro/yueqing-chamber",
      "worktree": "/Users/zky/.clawteam/workspaces/yc-rd-20260321-100000/dev1",
      "branch": "clawteam/yc-rd-20260321-100000/dev1",
      "startedAt": 0,
      "status": "running",
      "notifyOnComplete": true
    }
  ]
}
```

## Recommended first real run
先不要一口气做完整业务闭环。先挑一个**当前仓库里还没做过**的小而真实 feature 验证流水线：
- `企业名单按行业分类`
- 或 `通讯录仅登录会员可见`

不要再把 `企业名单独立模块` 当作新的从 0 到 1 run，因为当前仓库已经存在独立 companies 路由、入口和基础测试；继续把它当首个 feature 会把“已有能力”误判成“新交付”。
