import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const activities = await prisma.message.findMany({
    select: { id: true, nickname: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return NextResponse.json(activities);
}
