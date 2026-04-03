import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import routes from './routes';
import swaggerDocument from './swagger.json';

dotenv.config();

const dashboardPath = path.join(__dirname, '../../dashboard');

export function createApp() {
  const app = express();

  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  警告：JWT_SECRET 未设置，使用默认值（生产环境请设置环境变量）');
  }

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.sendFile(path.join(dashboardPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).json({ success: false, error: 'Not Found', message: '/api' });
      }
    });
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
