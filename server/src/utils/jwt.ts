import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yueqing-chamber-secret-key-2026';
const JWT_EXPIRES_IN = '7d'; // 7 天有效期

export interface JwtPayload {
  userId: string;
  phone: string;
  name: string;
}

/**
 * 生成 JWT Token
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * 获取 Token 过期时间
 */
export function getTokenExpiresIn(): string {
  return JWT_EXPIRES_IN;
}
