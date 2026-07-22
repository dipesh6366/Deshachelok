import { NextRequest, NextResponse } from 'next/server';
import { incrementArticleViews } from '@/lib/articles';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const views = await incrementArticleViews(id);
    if (views === null) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
