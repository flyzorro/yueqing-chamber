# 部署检查清单

## 📋 部署前检查

### 环境变量
- [ ] 获取生产数据库连接字符串 (DATABASE_URL)
- [ ] 生成强随机 JWT_SECRET (至少 32 字符)
- [ ] 确认 PORT=3000

### 数据库
- [ ] 创建生产 PostgreSQL 数据库
- [ ] 运行 `npx prisma migrate deploy`
- [ ] 验证数据库连接

### 代码
- [ ] 所有测试通过 (`npm test`)
- [ ] 代码审查通过
- [ ] 最新代码已 push 到 main 分支

---

## 🚀 部署步骤

### Step 1: 安装 Vercel CLI
```bash
npm install -g vercel
```

### Step 2: 登录 Vercel
```bash
vercel login
```

### Step 3: 部署后端
```bash
cd server
vercel --prod
```

### Step 4: 设置环境变量
访问 Vercel Dashboard → Settings → Environment Variables
添加以下变量：
- `DATABASE_URL` = 你的生产数据库连接字符串
- `JWT_SECRET` = 你的 JWT 密钥
- `PORT` = 3000
- `NODE_ENV` = production

### Step 5: 重新部署 (应用环境变量)
```bash
vercel --prod
```

### Step 6: 运行数据库迁移
```bash
# 在 Vercel Settings → Deployment Hooks 中配置
# 或手动执行
vercel env pull  # 拉取环境变量
npx prisma migrate deploy
```

### Step 7: 验证部署
```bash
# 健康检查
curl https://your-app.vercel.app/health

# 测试 API
curl https://your-app.vercel.app/api/members
```

---

## 📱 移动端配置

### 更新 API 地址
编辑 `mobile/app/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://your-app.vercel.app';
```

### 重新构建 APP
```bash
cd mobile
eas build --platform ios  # 或 android
```

---

## ✅ 验证清单

部署后验证以下功能：
- [ ] 用户注册/登录
- [ ] 会员列表加载
- [ ] 活动列表加载
- [ ] 活动报名
- [ ] 个人中心
- [ ] 数据持久化

---

## 📊 监控

### 查看日志
```bash
vercel logs
```

### 查看部署
```bash
vercel ls
```

### 回滚 (如需)
```bash
vercel rollback
```

---

## 🆘 故障排查

### 常见问题

**1. 数据库连接失败**
- 检查 DATABASE_URL 格式
- 确认数据库允许外部连接
- 检查防火墙设置

**2. 环境变量未生效**
- 重新部署应用
- 检查变量名是否正确
- 确认变量作用域 (Production)

**3. API 返回 500 错误**
- 查看 Vercel 日志
- 检查 Prisma schema 是否同步
- 验证数据库表是否存在

---

## 📞 支持

- Vercel 文档：https://vercel.com/docs
- Prisma 文档：https://www.prisma.io/docs
- 项目 Issues: https://github.com/flyzorro/yueqing-chamber/issues
