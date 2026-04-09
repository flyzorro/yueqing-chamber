# 乐清商会 APP - 项目代码地图

> 生成时间：2026-04-09  
> 模式：`project`  
> 状态：✅ 已上线

---

## 一、项目概述

**项目名称**：乐清商会 APP (yueqing-chamber)  
**技术栈**：
- **后端**：Node.js + Express + TypeScript + Prisma + PostgreSQL
- **移动端**：React Native + Expo (v55)
- **部署**：Railway (后端) + Neon (数据库)

**生产环境地址**：https://yueqing-chamber-production.up.railway.app

---

## 二、项目架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      移动端 (React Native)                   │
│                    mobile/ (Expo SDK 55)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ 首页    │ │ 会员    │ │ 活动    │ │ 企业    │ │ 我的    ││
│  │ index   │ │ members │ │ activity│ │companies│ │ profile ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│         │           │           │           │           │    │
│         └───────────┴───────────┼───────────┴───────────┘    │
│                                 │                            │
│                    ┌────────────┴────────────┐               │
│                    │  utils/api.ts + auth.ts │               │
│                    │  API 调用 + Token 管理     │               │
│                    └────────────┬────────────┘               │
└─────────────────────────────────┼─────────────────────────────┘
                                  │ HTTP/HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    后端 API (Express + TS)                    │
│                      server/src/                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   middleware/                            │ │
│  │  ┌──────────────┐  ┌──────────────┐                     │ │
│  │  │ auth.ts      │  │ validator.ts │                     │ │
│  │  │ JWT 验证      │  │ 请求验证      │                     │ │
│  │  └──────────────┘  └──────────────┘                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     routes/                              │ │
│  │  ┌──────┐ ┌─────────┐ ┌──────────┐ ┌────────────┐      │ │
│  │  │ auth │ │ members │ │ activity │ │ companies  │      │ │
│  │  └──────┘ └─────────┘ └──────────┘ └────────────┘      │ │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────┐            │ │
│  │  │ civilServ. │ │ index.ts   │ │ ...      │            │ │
│  │  └────────────┘ └────────────┘ └──────────┘            │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     models/                              │ │
│  │  业务逻辑层：Member, Activity, Company, User...          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    lib/prisma.ts                         │ │
│  │                  Prisma Client 单例                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据库 (PostgreSQL)                        │
│                   Neon Serverless                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Prisma Schema                        │ │
│  │  User | Member | Company | Activity | Registration...   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、核心模块与入口点

### 3.1 后端模块 (`server/src/`)

| 模块 | 路径 | 职责 |
|------|------|------|
| **入口** | `index.ts` | Express 服务器启动、中间件注册、路由挂载 |
| **应用配置** | `app.ts` | Express 应用配置、CORS、JSON 解析 |
| **路由** | `routes/` | API 端点定义与请求处理 |
| **中间件** | `middleware/` | JWT 认证、请求验证 |
| **模型层** | `models/` | 业务逻辑与数据访问 |
| **工具** | `utils/` | JWT 生成与验证 |
| **数据库** | `lib/prisma.ts` | Prisma Client 单例 |
| **测试** | `__tests__/` | 单元测试与集成测试 |

### 3.2 移动端模块 (`mobile/`)

| 模块 | 路径 | 职责 |
|------|------|------|
| **入口** | `index.ts` | Expo 应用注册 |
| **根布局** | `app/_layout.tsx` | 全局导航配置 |
| **Tab 导航** | `app/(tabs)/_layout.tsx` | 底部 Tab 栏配置 |
| **首页** | `app/(tabs)/index.tsx` | 商会介绍 + 快捷入口 |
| **会员中心** | `app/(tabs)/members.tsx` | 会员列表 |
| **活动管理** | `app/(tabs)/activities.tsx` | 活动列表 + 报名 |
| **企业服务** | `app/(tabs)/services.tsx` | 服务列表 |
| **个人中心** | `app/(tabs)/profile.tsx` | 用户信息 + 设置 |
| **登录页** | `app/login.tsx` | 手机号登录/注册 |
| **API 工具** | `app/utils/api.ts` | API 客户端配置 |
| **认证工具** | `app/utils/auth.ts` | Token 存储与读取 |

---

## 四、数据库模型关系图

```mermaid
erDiagram
    User ||--o{ "Session" : "auth"
    Member ||--o{ Registration : "participates"
    Activity ||--o{ Registration : "has"
    Activity ||--o{ ActivityPhoto : "contains"
    Company ||--o{ CompanyProduct : "owns"
    
    User {
        String id PK
        String phone UK
        String password
        String name
        String? avatar
    }
    
    Member {
        String id PK
        String phone UK
        String name
        String? email
        String company
        String? position
        String? district
        String? chamberTitle
    }
    
    Activity {
        String id PK
        String title
        DateTime date
        String location
        Int maxParticipants
        Int currentParticipants
        String status
    }
    
    Registration {
        String id PK
        String memberId FK
        String activityId FK
        String status
    }
    
    Company {
        String id PK
        String name UK
        String? industry
        String? contactName
        String? phone
        String? summary
    }
    
    CompanyProduct {
        String id PK
        String companyId FK
        String name
        String description
        String? imageUrl
        Int sortOrder
    }
```

---

## 五、API 端点清单

### 5.1 认证接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |

### 5.2 会员接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/members` | 会员列表 (分页) | ❌ |
| GET | `/api/members/:id` | 会员详情 | ❌ |
| POST | `/api/members` | 创建会员 | ✅ |
| PUT | `/api/members/:id` | 更新会员 | ✅ |
| DELETE | `/api/members/:id` | 删除会员 | ✅ |

### 5.3 活动接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/activities` | 活动列表 (分页) | ❌ |
| GET | `/api/activities/:id` | 活动详情 | ❌ |
| GET | `/api/activities/:id/registrations` | 活动报名列表 | ✅ |
| POST | `/api/activities` | 创建活动 | ✅ |
| PUT | `/api/activities/:id` | 更新活动 | ✅ |
| DELETE | `/api/activities/:id` | 删除活动 | ✅ |
| POST | `/api/activities/:id/register` | 活动报名 | ✅ |

### 5.4 企业接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/companies` | 企业列表 | ❌ |
| GET | `/api/companies/:id` | 企业详情 | ❌ |
| GET | `/api/companies/:id/products` | 企业产品列表 | ❌ |
| POST | `/api/companies` | 创建企业 | ✅ |
| PUT | `/api/companies/:id` | 更新企业 | ✅ |

### 5.5 公务员接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/civil-servants` | 公务员列表 | ❌ |
| POST | `/api/civil-servants` | 创建公务员 | ✅ |

### 5.6 健康检查

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |

---

## 六、跨模块流程

### 6.1 用户登录流程

```
[移动端 login.tsx]
    │
    ▼
输入手机号 + 密码
    │
    ▼
调用 POST /api/auth/login
    │
    ▼
[后端 routes/auth.ts]
    │
    ▼
验证用户存在 & 密码比对
    │
    ▼
生成 JWT Token
    │
    ▼
返回 token + user info
    │
    ▼
[移动端] 存储 token (AsyncStorage)
    │
    ▼
后续请求携带 Authorization header
```

### 6.2 活动报名流程

```
[移动端 activities.tsx]
    │
    ▼
用户点击"立即报名"
    │
    ▼
检查登录状态 (auth.ts)
    │
    ▼
POST /api/activities/:id/register
    │
    ▼
[后端 routes/activities.ts]
    │
    ▼
验证 JWT (auth 中间件)
    │
    ▼
检查活动是否存在 & 未满员
    │
    ▼
创建 Registration 记录
    │
    ▼
更新 Activity.currentParticipants
    │
    ▼
返回报名成功
```

---

## 七、关键配置

### 7.1 环境变量

| 变量 | 位置 | 描述 |
|------|------|------|
| `DATABASE_URL` | Railway | PostgreSQL 连接字符串 |
| `JWT_SECRET` | Railway | JWT 签名密钥 |
| `EXPO_PUBLIC_API_BASE_URL` | mobile/.env | 移动端 API 基础地址 |

### 7.2 重要配置文件

| 文件 | 作用 |
|------|------|
| `server/prisma/schema.prisma` | 数据库模型定义 |
| `mobile/app.json` | Expo 应用配置 |
| `mobile/tsconfig.json` | TypeScript 配置 |
| `server/tsconfig.json` | 后端 TypeScript 配置 |
| `railway.json` | Railway 部署配置 |

---

## 八、测试结构

### 8.1 后端测试 (`server/src/__tests__/`)

| 测试文件 | 测试范围 |
|---------|---------|
| `app.test.ts` | Express 应用基础测试 |
| `members.test.ts` | 会员 CRUD 测试 |
| `activityRegistration.test.ts` | 活动报名流程测试 |
| `activityPhotos.test.ts` | 活动照片上传测试 |
| `companies.test.ts` | 企业管理测试 |
| `civilServants.test.ts` | 公务员管理测试 |
| `validator.test.ts` | 请求验证器测试 |

### 8.2 E2E 测试 (`e2e/`)

| 文件 | 描述 |
|------|------|
| `playwright.config.ts` | Playwright 配置 |
| `e2e/*.spec.ts` | 端到端测试用例 |

---

## 九、文档与规范

| 文档 | 路径 | 内容 |
|------|------|------|
| 项目总结 | `PROJECT_SUMMARY.md` | 功能清单 + 部署状态 |
| 部署指南 | `DEPLOY.md` | 部署步骤说明 |
| 部署检查清单 | `DEPLOY_CHECKLIST.md` | 上线前检查项 |
| API 文档 | `server/swagger.json` | Swagger/OpenAPI 规范 |
| 团队文档 | `TEAM.md` | 团队协作规范 |
| 需求文档 | `prd.json` | 产品需求定义 |

---

## 十、项目目录结构

```
yueqing-chamber/
├── server/                          # 后端 API
│   ├── src/
│   │   ├── index.ts                 # 入口文件
│   │   ├── app.ts                   # Express 配置
│   │   ├── routes/                  # API 路由
│   │   │   ├── index.ts             # 路由汇总
│   │   │   ├── auth.ts              # 认证接口
│   │   │   ├── members.ts           # 会员接口
│   │   │   ├── activities.ts        # 活动接口
│   │   │   ├── companies.ts         # 企业接口
│   │   │   └── civilServants.ts     # 公务员接口
│   │   ├── middleware/              # 中间件
│   │   │   ├── auth.ts              # JWT 认证
│   │   │   └── validator.ts         # 请求验证
│   │   ├── models/                  # 业务逻辑层
│   │   │   ├── User.ts
│   │   │   ├── Member.ts
│   │   │   ├── Activity.ts
│   │   │   ├── Company.ts
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── prisma.ts            # Prisma 单例
│   │   ├── utils/
│   │   │   └── jwt.ts               # JWT 工具
│   │   ├── data/                    # 测试数据
│   │   └── __tests__/               # 单元测试
│   ├── prisma/
│   │   └── schema.prisma            # 数据库模型
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                          # 移动端 APP
│   ├── app/
│   │   ├── (tabs)/                  # Tab 页面
│   │   │   ├── _layout.tsx          # Tab 布局
│   │   │   ├── index.tsx            # 首页
│   │   │   ├── members.tsx          # 会员
│   │   │   ├── activities.tsx       # 活动
│   │   │   ├── services.tsx         # 服务
│   │   │   └── profile.tsx          # 我的
│   │   ├── activity-detail.tsx      # 活动详情
│   │   ├── member-detail.tsx        # 会员详情
│   │   ├── company-detail.tsx       # 企业详情
│   │   ├── login.tsx                # 登录/注册
│   │   ├── utils/
│   │   │   ├── api.ts               # API 客户端
│   │   │   └── auth.ts              # 认证工具
│   │   ├── _layout.tsx              # 根布局
│   │   └── index.ts                 # Expo 入口
│   ├── app.json                     # Expo 配置
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                            # 项目文档
│   ├── feature-service-category-entries.md
│   ├── qa-baseline.md
│   └── requirement-gap-analysis.md
│
├── agents/                          # AI Agent 配置
│   ├── deploy-agent.md
│   ├── dev-agent.md
│   └── qa-agent.md
│
├── e2e/                             # E2E 测试
│   └── *.spec.ts
│
├── scripts/                         # 工具脚本
│
├── openspec/                        # OpenSpec 配置
│
├── graphify-out/                    # Graphify 知识图谱输出
│
├── .omc/                            # OMC 配置
│
├── .gstack/                         # GStack 配置
│
├── PROJECT_SUMMARY.md               # 项目总结
├── DEPLOY.md                        # 部署指南
├── DEPLOY_CHECKLIST.md              # 部署检查清单
├── TEAM.md                          # 团队文档
├── README.md                        # 项目说明
└── prd.json                         # 产品需求
```

---

## 十一、下一步开发建议

### 11.1 待完善功能

1. **活动详情页** - 完整活动信息与报名状态展示
2. **会员详情页** - 会员详细信息与联系方式
3. **消息通知** - 活动提醒、报名确认
4. **企业服务预约** - 在线预约表单

### 11.2 技术优化

1. **错误监控** - 接入 Sentry 进行生产环境错误追踪
2. **性能监控** - API 响应时间追踪与告警
3. **移动端打包** - iOS/Android 应用打包发布
4. **自动化测试** - 增加 E2E 测试覆盖率

---

## 十二、快速参考

### 启动后端

```bash
cd server
npm install
npx prisma migrate dev
npm start
```

### 启动移动端

```bash
cd mobile
npm install
npx expo start
```

### 运行测试

```bash
# 后端单元测试
cd server
npm test

# E2E 测试
npm run test:e2e
```

---

**文档状态**：✅ 完整  
**最后更新**：2026-04-09 11:25 (v1.1)

---

## 十三、补充：项目特有设施

### 13.1 Git Worktrees

项目使用 `git worktree` 进行多分支并行开发：

```
.worktrees/
├── company-intro/       # 企业介绍功能分支
├── update-product-images/ # 产品图片更新分支
└── fix-product-images/    # 产品图片修复分支
```

**优势**：多个功能分支同时开发，无需来回 `git checkout` 切换。

### 13.2 Graphify 知识图谱

```
graphify-out/
└── GRAPH_REPORT.md   # 知识图谱分析报告
```

**用途**：自动扫描代码库生成知识图谱，帮助理解代码结构和依赖关系。

### 13.3 OpenSpec 规范

```
openspec/
├── specs/      # 规格定义
└── changes/    # 变更追踪
```

**用途**：基于 OpenSpec 协议的需求 - 代码双向追踪系统。

### 13.4 AI Agent 配置

```
agents/
├── deploy-agent.md   # 部署 Agent 配置
├── dev-agent.md      # 开发 Agent 配置
└── qa-agent.md       # QA Agent 配置
```

**用途**：定义 AI Agent 在特定场景下的行为规范和工作流程。

### 13.5 GStack 配置

```
.gstack/
└── qa-reports/   # QA 测试报告
```

**用途**：GStack 增强配置和 QA 报告存储。

---

## 十四、SDD-RIPER 资产

### 14.1 CodeMap 索引

| 文件 | 生成时间 | 模式 |
|------|----------|------|
| `2026-04-09_11-15_yueqing-chamber 项目总图.md` | 2026-04-09 11:15 | `project` |

### 14.2 Context Bundle

> 待生成 - 执行 `build_context_bundle: ./docs/` 后更新

### 14.3 Specs

> 待生成 - 执行 `sdd_bootstrap` 后更新
