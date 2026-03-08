import { PrismaClient } from '@prisma/client';

// 测试数据库连接
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    await prisma.$connect();
    res.status(200).json({ 
      status: 'ok', 
      message: 'Database connected!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}
