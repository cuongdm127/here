import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'node:crypto';

export async function POST(req: Request) {
  const ip = req.headers.get('x-real-ip') ?? '0.0.0.0';
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

  // bốc ngẫu nhiên 1 message chưa gửi cho IP này
  const [msg] = await prisma.$queryRaw<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[]
  >`SELECT id, content, emotion FROM "Message" ORDER BY RANDOM() LIMIT 1`;

  await prisma.envelope.create({
    data: { messageId: msg.id, ipHash },
  });

  return NextResponse.json(msg);
}
