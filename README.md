# 乐清商会 APP

乐清商会移动端应用，支持 iOS 和 Android。

## 技术栈

- **前端**: React Native + Expo
- **后端**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL (计划)

## 项目结构

```
yueqing-chamber/
├── server/          # 后端 API
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/
│   └── package.json
│
├── mobile/          # 移动端 APP
│   ├── app/         # 页面
│   └── package.json
│
└── .github/
    └── workflows/
        └── ci.yml   # CI 配置
```

## 功能模块

- 首页 - 商会动态、公告
- 会员中心 - 会员列表、详情
- 活动管理 - 活动发布、报名
- 商会服务 - 服务咨询
- 个人中心 - 会员信息

## 开发

```bash
# 后端
cd server && npm run dev

# 移动端
cd mobile && npx expo start
```

## License

MIT