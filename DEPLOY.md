# 部署指南

## Preview 环境部署

### 方案一：Vercel (推荐 - 快速简单)

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署后端
```bash
cd server
vercel --prod
```

#### 4. 设置环境变量
在 Vercel Dashboard 中设置：
- `DATABASE_URL` - PostgreSQL 连接字符串
- `JWT_SECRET` - JWT 签名密钥
- `PORT` - 3000

### 方案二：Railway (完整支持 PostgreSQL)

#### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. 初始化项目
```bash
cd server
railway init
```

#### 3. 添加 PostgreSQL 数据库
```bash
railway add postgres
```

#### 4. 部署
```bash
railway up
```

### 方案三：Docker 部署

#### 1. 构建镜像
```bash
docker build -t yueqing-chamber-server ./server
```

#### 2. 运行容器
```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=your_db_url \
  -e JWT_SECRET=your_secret \
  yueqing-chamber-server
```

## 生产环境配置

### 数据库迁移
```bash
cd server
npx prisma migrate deploy
```

### 环境变量检查清单
- [ ] `DATABASE_URL` - 生产数据库连接
- [ ] `JWT_SECRET` - 强随机密钥 (至少 32 字符)
- [ ] `NODE_ENV` - production
- [ ] `PORT` - 3000

### 安全建议
1. 使用强密码保护数据库
2. 启用 HTTPS
3. 定期更新依赖
4. 配置 CORS 白名单
5. 启用速率限制

## 移动端配置

更新 mobile/app/lib/api.ts 中的 API_BASE_URL 为部署后的地址。

## 监控与维护

### 日志查看
- Vercel: `vercel logs`
- Railway: `railway logs`

### 健康检查
```bash
curl https://your-domain.com/health
```
