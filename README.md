# 乐清商会 APP

> 乐清商会官方移动端应用 - 连接会员，服务商会

[![Status](https://img.shields.io/badge/status-online-success)](https://yueqing-chamber-production.up.railway.app)
[![API Docs](https://img.shields.io/badge/API-docs-blue)](https://yueqing-chamber-production.up.railway.app/api/docs)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🚀 快速访问

**后端 API:** https://yueqing-chamber-production.up.railway.app  
**API 文档:** https://yueqing-chamber-production.up.railway.app/api/docs  
**健康检查:** https://yueqing-chamber-production.up.railway.app/health

---

## 📱 功能模块

- **首页** - 商会介绍、快捷入口、最新动态
- **会员中心** - 会员列表、搜索、分页查询
- **活动管理** - 活动列表、在线报名、分页加载
- **商会服务** - 法律、财税、融资等服务
- **个人中心** - 用户信息、登录状态、设置
- **登录/注册** - 手机号登录注册

---

## 🛠️ 技术栈

### 后端
- **框架**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL (Neon)
- **ORM**: Prisma
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **监控**: Sentry
- **部署**: Railway

### 前端
- **框架**: React Native + Expo
- **导航**: Expo Router
- **存储**: AsyncStorage
- **平台**: iOS & Android

---

## 📦 项目结构

```
yueqing-chamber/
├── server/                  # 后端 API
│   ├── src/
│   │   ├── index.ts         # 入口文件
│   │   ├── routes/          # API 路由
│   │   ├── middleware/      # 中间件
│   │   ├── lib/             # 工具函数
│   │   └── swagger.json     # API 文档
│   ├── prisma/
│   │   └── schema.prisma    # 数据库模型
│   ├── scripts/
│   │   └── backup.sh        # 备份脚本
│   └── package.json
│
├── mobile/                  # 移动端 APP
│   ├── app/
│   │   ├── index.tsx        # 首页
│   │   ├── login.tsx        # 登录/注册
│   │   ├── members.tsx      # 会员中心
│   │   ├── activities.tsx   # 活动管理
│   │   ├── services.tsx     # 商会服务
│   │   ├── profile.tsx      # 个人中心
│   │   └── utils/
│   │       └── api.ts       # API 配置
│   └── package.json
│
├── .github/
│   └── workflows/           # CI/CD
├── PROJECT_SUMMARY.md       # 项目总结
├── DEPLOY.md                # 部署指南
└── README.md                # 本文档
```

---

## 🚀 快速开始

### 后端开发

```bash
cd server

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动生产环境
npm start

# 运行测试
npm test
```

### 移动端开发

```bash
cd mobile

# 安装依赖
npm install

# 启动 Expo
npx expo start

# iOS 模拟器
npx expo run:ios

# Android 模拟器
npx expo run:android
```

---

## 📡 API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 会员
- `GET /api/members` - 获取会员列表
- `GET /api/members/:id` - 获取会员详情
- `POST /api/members` - 创建会员
- `PUT /api/members/:id` - 更新会员
- `DELETE /api/members/:id` - 删除会员

### 活动
- `GET /api/activities` - 获取活动列表
- `GET /api/activities/:id` - 获取活动详情
- `POST /api/activities/:id/register` - 活动报名
- `POST /api/activities` - 创建活动
- `PUT /api/activities/:id` - 更新活动
- `DELETE /api/activities/:id` - 删除活动

### 其他
- `GET /health` - 健康检查
- `GET /api/docs` - API 文档

---

## 🔧 环境变量

### 后端环境变量

```bash
# 数据库
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-secret-key

# Sentry (可选)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# 服务器
PORT=3000
NODE_ENV=production
```

---

## 📊 部署

### Railway 部署

1. 连接 GitHub 仓库
2. 设置环境变量
3. 自动部署

详细步骤见 [DEPLOY.md](DEPLOY.md)

---

## 📝 开发统计

| 指标 | 数据 |
|------|------|
| 后端 API 端点 | 10+ |
| 移动端页面 | 6 个 |
| 数据库表 | 3 个 |
| 代码行数 | 2000+ |

---

## 🤝 贡献

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- **GitHub**: https://github.com/flyzorro/yueqing-chamber
- **API**: https://yueqing-chamber-production.up.railway.app

---

**最后更新**: 2026-03-08
# Webhook Test Mon Mar  9 23:46:25 CST 2026
