// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Có thể undefined lần đầu, sau đó gán instance
  var prisma: PrismaClient | undefined;
}

// Tạo 1 instance duy nhất dù hot-reload
export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
