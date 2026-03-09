# 🧭 AI 开发团队配置

## 团队结构

| 角色 | Agent ID | 职责 | 工作分支 | tmux 会话 |
|------|----------|------|----------|-----------|
| 🧭 指挥官 | `zoe` | 业务理解、任务拆解、质量把控 | `main` | `zoe` |
| 🔧 研发 | `dev-agent` | 功能开发、Code Review、技术决策 | `feature/*` | `dev` |
| 🧪 测试 | `qa-agent` | 单元测试、E2E 测试、Bug 报告 | `test/*` | `qa` |
| 📦 部署 | `deploy-agent` | CI/CD、监控、日志 | `deploy/*` | `deploy` |

---

## Agent 配置

### 🔧 Dev Agent (资深工程师)

**能力要求：**
- 5+ 年前端/后端开发经验
- 精通 React Native + Node.js + TypeScript
- 熟悉 Prisma + PostgreSQL
- 能独立做技术决策
- Code Review 严格但建设性

**工作模式：**
```bash
# 独立分支
git checkout -b feature/${task-name}

# tmux 会话（带日志）
tmux new-session -d -s dev -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o dev 'exec cat >>/tmp/dev-session.log'

# 执行任务
codex --yolo exec "<任务描述>"
```

**验收标准：**
- 代码通过 ESLint + TypeScript 检查
- 单元测试覆盖率 > 80%
- Code Review 通过
- 功能测试通过

---

### 🧪 QA Agent (资深测试工程师)

**能力要求：**
- 5+ 年测试经验
- 精通 Jest + Playwright
- 熟悉 API 测试、E2E 测试
- 能写清晰的 Bug 报告
- 自动化测试专家

**工作模式：**
```bash
# 独立分支
git checkout -b test/${task-name}

# tmux 会话（带日志）
tmux new-session -d -s qa -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o qa 'exec cat >>/tmp/qa-session.log'

# 执行任务
codex --yolo exec "运行测试套件 + 生成报告"
```

**验收标准：**
- 所有单元测试通过
- E2E 测试通过
- 无严重 Bug
- 测试报告完整

---

### 📦 Deploy Agent (运维工程师)

**能力要求：**
- 3+ 年 DevOps 经验
- 熟悉 Railway + Docker + GitHub Actions
- 熟悉监控和日志系统
- 能快速定位和修复部署问题

**工作模式：**
```bash
# 独立分支
git checkout -b deploy/${task-name}

# tmux 会话（带日志）
tmux new-session -d -s deploy -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o deploy 'exec cat >>/tmp/deploy-session.log'
```

**验收标准：**
- 部署成功
- 健康检查通过
- 监控正常
- 日志完整

---

## 协作流程

```
用户指令
   │
   ▼
┌─────────────┐
│   Zoe       │ ← 理解业务、拆解任务、定义验收标准
│ (指挥官)    │
└─────────────┘
   │
   ├──────────────────┬──────────────────┐
   ▼                  ▼                  ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Dev    │    │   QA    │    │ Deploy  │
│ Agent   │    │  Agent  │    │  Agent  │
└─────────┘    └─────────┘    └─────────┘
   │                  │                  │
   │  功能开发         │  测试验证         │  部署上线
   │  Code Review     │  Bug 报告        │  监控日志
   │                  │                  │
   ▼                  ▼                  ▼
┌─────────────────────────────────────────┐
│            Zoe (质量把控)                │
│   - Review 代码                          │
│   - 检查测试报告                          │
│   - 确认部署成功                          │
└─────────────────────────────────────────┘
   │
   ▼
用户汇报
```

---

## tmux 会话管理

### 创建会话
```bash
# Dev Agent
tmux new-session -d -s dev -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o dev 'exec cat >>/tmp/dev-session.log'

# QA Agent
tmux new-session -d -s qa -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o qa 'exec cat >>/tmp/qa-session.log'

# Deploy Agent
tmux new-session -d -s deploy -c /Users/zky/code/yueqing-chamber
tmux pipe-pane -o deploy 'exec cat >>/tmp/deploy-session.log'
```

### 查看会话
```bash
tmux list-sessions
tmux attach -t dev    # 查看 Dev 会话
tmux attach -t qa     # 查看 QA 会话
tmux attach -t deploy # 查看 Deploy 会话
```

### 查看日志
```bash
tail -f /tmp/dev-session.log
tail -f /tmp/qa-session.log
tail -f /tmp/deploy-session.log
```

### 清理会话
```bash
tmux kill-session -t dev
tmux kill-session -t qa
tmux kill-session -t deploy
```

---

## Git 工作流

```
main (Zoe)
  │
  ├── feature/* (Dev Agent)
  │     └── PR → main
  │
  ├── test/* (QA Agent)
  │     └── PR → main
  │
  └── deploy/* (Deploy Agent)
        └── PR → main
```

**规则：**
- 每个 agent 在独立分支工作
- 完成后创建 PR
- Zoe 负责 Code Review
- 通过后 merge 到 main

---

## 下一步

1. 创建 agent 配置文件
2. 初始化 tmux 会话
3. 创建独立分支
4. 测试协作流程
