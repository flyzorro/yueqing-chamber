# 乐清商会 APP

> 乐清商会项目仓库：移动端、后端 API、仓库级 E2E 测试并置在同一仓库中。

[![Status](https://img.shields.io/badge/status-online-success)](https://yueqing-chamber-production.up.railway.app)
[![API Docs](https://img.shields.io/badge/API-docs-blue)](https://yueqing-chamber-production.up.railway.app/api/docs)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 当前仓库定位

这个仓库当前不是 workspace/turbo 式 monorepo，也不是单一 Expo 应用仓库。

它的真实形态是一个 **并置式仓库（co-located repo）**：

- `mobile/`：Expo / React Native 移动端
- `server/`：Express / Prisma 后端 API
- `e2e/`：仓库级 Playwright 端到端测试
- `dashboard/`：历史静态页面，目前不再是产品主入口，后续计划移除
- 根目录 `package.json`：主要承载仓库级 E2E 依赖与脚本，不是业务主应用

---

## 快速访问

**后端 API:** https://yueqing-chamber-production.up.railway.app  
**API 文档:** https://yueqing-chamber-production.up.railway.app/api/docs  
**健康检查:** https://yueqing-chamber-production.up.railway.app/health

---

## 产品功能

- **首页** - 商会介绍、快捷入口、最新动态
- **会员中心** - 会员列表、搜索、分页查询
- **活动管理** - 活动列表、在线报名、分页加载
- **商会服务** - 法律、财税、融资等服务
- **个人中心** - 用户信息、登录状态、设置
- **登录/注册** - 手机号登录注册

---

## 技术栈

### 服务端
- **框架**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL (Neon)
- **ORM**: Prisma
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **监控**: Sentry
- **部署**: Railway / Vercel 兼容入口

### 移动端
- **框架**: React Native + Expo
- **导航**: Expo Router
- **存储**: AsyncStorage
- **平台**: iOS & Android

### 仓库级测试
- **E2E**: Playwright

---

## 仓库结构

```text
yueqing-chamber/
├── .github/workflows/       # CI
├── e2e/                     # Playwright E2E
├── mobile/                  # Expo 移动端
│   ├── app/
│   ├── assets/
│   └── package.json
├── server/                  # Express + Prisma API
│   ├── src/
│   ├── prisma/
│   ├── scripts/
│   └── package.json
├── dashboard/               # 历史静态页面（计划移除）
├── docs/                    # 截图等文档资产
├── package.json             # 仓库级测试壳，不是业务主应用
└── README.md
```

---

## 运行边界

```text
mobile  --->  server  --->  postgres
   \            |
    \           +--> /api/docs
     \          +--> /health
      \
       +--> e2e 通过根级 Playwright 脚本做系统验证
```

说明：
- `mobile/` 是用户产品入口
- `server/` 是唯一业务 API 边界
- 根目录只负责仓库级测试与文档组织
- `dashboard/` 不是当前产品主入口，也不应继续承载新的产品能力

---

## 快速开始

### 1) 启动后端

```bash
cd server
npm install
npm run dev
```

默认提供：
- API: `http://localhost:3000/api`
- Docs: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/health`

### 2) 启动移动端

```bash
cd mobile
npm install
npx expo start
```

### 3) 运行仓库级 E2E

```bash
npm install
npx playwright test
```

---

## API 概览

### 认证
- `POST /api/auth/register`
- `POST /api/auth/login`

### 会员
- `GET /api/members`
- `GET /api/members/:id`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`

### 活动
- `GET /api/activities`
- `GET /api/activities/:id`
- `POST /api/activities/:id/register`
- `POST /api/activities`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`

### 系统
- `GET /health`
- `GET /api/docs`

---

## 环境变量

### server/.env

```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
PORT=3000
NODE_ENV=production
```

> 注：移动端当前直接使用内置 API base URL。后续会收敛到环境变量注入，而不是继续把环境选择写死在页面代码里。

---

## CI

当前 CI 覆盖三层：
- `server`：lint / typecheck / test
- `mobile`：typecheck
- `e2e`：端到端回归

UI 变更的 PR 还要求提供截图证据：
- PR 描述里附图，或
- 提交到 `docs/screenshots/`

---

## 当前决议

- 先保持 `mobile/` 与 `server/` 的双应用边界清晰
- 暂不把仓库升级成 workspace/turbo monorepo
- `dashboard/` 不再继续演化，后续移除
- 根目录保持为仓库级测试壳，不扩展业务依赖

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)
