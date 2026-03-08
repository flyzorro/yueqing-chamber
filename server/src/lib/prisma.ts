// Prisma 7 使用 namespace 导入
import * as Prisma from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: Prisma.PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new Prisma.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;