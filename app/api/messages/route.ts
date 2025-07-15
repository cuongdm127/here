import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const VI_BLOCKLIST = [
  'đm', 'dm', 'địt', 'dit', 'cc', 'vcl', 'vkl', 'cặc', 'lồn', 
  'bú', 'bú liếm', 'chó', 'đĩ', 'đĩ điếm', /*…thêm tuỳ thích*/
];

const MessageSchema = z.object({
  nickname: z.string().min(1),
  content: z.string().min(1).max(500),
  emotion: z.string().optional(),
});

function containsBadWord(text: string) {
  const t = text.toLowerCase();
  return VI_BLOCKLIST.some(bad => t.includes(bad));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const limit = Number(url.searchParams.get('limit') ?? 20);

  const messages = await prisma.message.findMany({
    where: { isToxic: false },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(messages);
}


export async function POST(req: Request) {
  // Validate input
  const parsed = MessageSchema.parse(await req.json());
  const { nickname, content, emotion } = parsed;

  if (containsBadWord(content)) {
    return NextResponse.json(
      { error: 'Content is not good!' },
      { status: 400 }
    );
  }

  // Initialize OpenAI client for moderation
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const translationRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a Vietnamese→English translator.' },
      { role: 'user',   content: `Translate this to English: "${content}"` },
    ]
  });
  let translated = translationRes.choices[0].message.content;
  translated = translated ?? content;

  // Call Moderation API
  const modRes = await openai.moderations.create({ input: translated });
  if (modRes.results[0].flagged) {
    return NextResponse.json(
      { error: 'Content is not good!' },
      { status: 400 }
    );
  }

  // Save non-toxic message
  const msg = await prisma.message.create({
    data: { nickname, content, emotion, isToxic: false },
  });

  return NextResponse.json(msg, { status: 201 });
}
