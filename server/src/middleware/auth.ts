import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * 认证中间件 - 验证 JWT Token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  // 从 Header 获取 Token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      success: false, 
      error: '未提供认证 token' 
    });
    return;
  }

  const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

  // 验证 Token
  const payload = verifyToken(token);
  
  if (!payload) {
    res.status(401).json({ 
      success: false, 
      error: 'Token 无效或已过期' 
    });
    return;
  }

  // 将用户信息附加到 request
  req.user = payload;
  next();
}

/**
 * 可选认证中间件 - Token 存在则验证，不存在也允许访问
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 没有 Token，继续
    next();
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  
  if (payload) {
    req.user = payload;
  }

  next();
}
