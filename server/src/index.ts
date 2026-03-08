import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerDocument from './swagger.json';

dotenv.config();

// 初始化 Sentry 错误监控
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
  console.log('✅ Sentry 错误监控已启用');
}

const app = express();

// 检查 JWT_SECRET 是否配置
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  警告：JWT_SECRET 未设置，使用默认值（生产环境请设置环境变量）');
}

// 中间件
app.use(cors());
app.use(express.json());

// Sentry 请求处理器（必须在路由之前）
if (process.env.SENTRY_DSN) {
  app.use(Sentry.requestHandler());
  app.use(Sentry.tracingHandler());
}

// Swagger API 文档
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sentry 错误处理器（必须在路由之后）
if (process.env.SENTRY_DSN) {
  app.use(Sentry.errorHandler());
}

// Vercel 导出
export default app;

// 启动服务器 (Vercel 会忽略 listen，Railway/本地会执行)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});