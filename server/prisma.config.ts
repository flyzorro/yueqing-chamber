import type { PrismaConfig } from '@prisma/client';

export default {
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
} satisfies PrismaConfig;
