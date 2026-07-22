import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { getArticleById, updateArticle, deleteArticleById, SlugConflictError } from '@/lib/articles';
import { getAuthenticatedUser, canManageArticle } from '@/lib/auth-server';
import { articleUpdateSchema } from '@/lib/validation';

// This endpoint is only used by the (authenticated) editor UI to look up an
// article being edited, so it requires auth + ownership like the mutating
// routes below rather than being publicly readable. Public article display
// goes through lib/articles.ts#getArticleBySlug() directly from the article
// page (server component) — this route is never used for that.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    if (!canManageArticle(user, article.authorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    if (!canManageArticle(user, existing.authorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const input = articleUpdateSchema.parse(body);
    // authorId/authorEmail are never re-derived from the request body on
    // update, so an editor can't reassign an article to another author.
    const updated = await updateArticle(id, input);
    if (!updated) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // On-demand ISR: refresh the home page and this article's page(s)
    // immediately instead of waiting for the next revalidate window.
    // If the slug changed, refresh both the old and new URL.
    revalidatePath('/');
    revalidatePath(`/article/${updated.slug}`);
    if (existing.slug !== updated.slug) {
      revalidatePath(`/article/${existing.slug}`);
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid article data', details: error.flatten() }, { status: 400 });
    }
    if (error instanceof SlugConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    if (!canManageArticle(user, existing.authorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deleted = await deleteArticleById(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath(`/article/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
