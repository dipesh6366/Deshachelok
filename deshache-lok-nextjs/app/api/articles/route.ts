import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { getAllArticles, getArticlesByAuthor, createArticle, SlugConflictError } from '@/lib/articles';
import { getAuthenticatedUser, isSuperAdmin } from '@/lib/auth-server';
import { articleInputSchema } from '@/lib/validation';

// Requires auth. Returns the caller's own articles, or every article if
// they're a super admin. There is no "public, unfiltered" list — that would
// leak unpublished drafts (including other authors') to anyone who finds
// this URL. Published articles for public display come from
// lib/articles.ts#getPublishedArticles(), used directly by the home page.
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = isSuperAdmin(user.email) ? await getAllArticles() : await getArticlesByAuthor(user.uid);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = articleInputSchema.parse(body);

    // authorId/authorEmail/id/views are always derived server-side from the
    // verified token — never taken from the request body — so a caller
    // can't create an article that impersonates someone else.
    const article = await createArticle({
      ...input,
      authorId: user.uid,
      authorEmail: user.email || undefined,
    });

    // On-demand ISR: refresh the home page and this article's page
    // immediately instead of waiting for the next revalidate window.
    revalidatePath('/');
    revalidatePath(`/article/${article.slug}`);

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid article data', details: error.flatten() }, { status: 400 });
    }
    if (error instanceof SlugConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
