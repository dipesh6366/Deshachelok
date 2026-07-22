import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

// Public and unauthenticated, but only ever returns published articles —
// this must never leak an unpublished draft to someone who guesses/knows
// its slug. (Not currently called from anywhere in the app — the article
// page fetches server-side via lib/articles.ts directly — kept as a public
// read API in case it's needed for an external integration later.)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article || article.status !== 'published') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
