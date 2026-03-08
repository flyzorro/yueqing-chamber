import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 检查 JWT_SECRET 是否配置
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  警告：JWT_SECRET 未设置，使用默认值（生产环境请设置环境变量）');
}

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});