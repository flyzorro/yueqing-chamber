import { Router, Request, Response } from 'express';
import { userStore } from '../models/User';
import { generateToken } from '../utils/jwt';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, password, name } = req.body;

    // 验证必填字段
    if (!phone || !password || !name) {
      res.status(400).json({ 
        success: false, 
        error: '手机号、密码和姓名不能为空' 
      });
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ 
        success: false, 
        error: '手机号格式不正确' 
      });
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      res.status(400).json({ 
        success: false, 
        error: '密码至少 6 位' 
      });
      return;
    }

    // 创建用户
    const user = await userStore.create({ phone, password, name });
    
    if (!user) {
      res.status(400).json({ 
        success: false, 
        error: '该手机号已注册' 
      });
      return;
    }

    // 生成 Token
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: '注册失败' 
    });
  }
});

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // 验证必填字段
    if (!phone || !password) {
      res.status(400).json({ 
        success: false, 
        error: '手机号和密码不能为空' 
      });
      return;
    }

    // 查找用户
    const user = await userStore.getByPhone(phone);
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: '手机号或密码错误' 
      });
      return;
    }

    // 验证密码
    const isValid = await userStore.verifyPassword(password, user.password);
    
    if (!isValid) {
      res.status(401).json({ 
        success: false, 
        error: '手机号或密码错误' 
      });
      return;
    }

    // 生成 Token
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      name: user.name
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: '登录失败' 
    });
  }
});

/**
 * GET /api/auth/me
 * 获取当前用户信息（需要认证）
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        error: '未认证' 
      });
      return;
    }

    const user = await userStore.getById(req.user.userId);
    
    if (!user) {
      res.status(404).json({ 
        success: false, 
        error: '用户不存在' 
      });
      return;
    }

    const { password: _password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取用户信息失败' 
    });
  }
});

export default router;
