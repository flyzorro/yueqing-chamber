import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerDocument from './swagger.json';

dotenv.config();

export function createApp() {
  const app = express();

  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  警告：JWT_SECRET 未设置，使用默认值（生产环境请设置环境变量）');
  }

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ success: true, message: 'Yueqing Chamber API', version: '1.0.0' });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', routes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

const app = createApp();

export default app;
