import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerDocument from './swagger.json';

dotenv.config();

export function createApp() {
  const app = express();

  // 检查 JWT_SECRET 是否配置
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  警告：JWT_SECRET 未设置，使用默认值（生产环境请设置环境变量）');
  }

  // 中间件
  app.use(cors());
  app.use(express.json());

  // 根路径不再承载历史 dashboard，避免将静态站点绑定为 server 运行时职责
  app.get('/', (_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'Use /api, /api/docs, or /health.',
    });
  });

  // Swagger API 文档
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // 路由
  app.use('/api', routes);

  // 健康检查
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

const app = createApp();

// Vercel 导出
export default app;

// 启动服务器 (Vercel 会忽略 listen，Railway/本地会执行)
if (require.main === module) {
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
}
