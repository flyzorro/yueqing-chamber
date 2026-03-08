import { Router } from 'express';

const router = Router();

// POST /api/auth/login - 登录
router.post('/login', (req, res) => {
  res.json({ message: '登录', data: req.body });
});

// POST /api/auth/register - 注册
router.post('/register', (req, res) => {
  res.json({ message: '注册', data: req.body });
});

// POST /api/auth/logout - 登出
router.post('/logout', (req, res) => {
  res.json({ message: '登出' });
});

export default router;