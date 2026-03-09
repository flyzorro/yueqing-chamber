import jwt from 'jsonwebtoken';

// JWT 密钥必须从环境变量读取，不允许硬编码
const JWT_SECRET: string = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in .env file or environment variables.');
}

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
  } catch (_error) {
    return null;
  }
}

/**
 * 获取 Token 过期时间
 */
export function getTokenExpiresIn(): string {
  return JWT_EXPIRES_IN;
}
