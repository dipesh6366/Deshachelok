import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { reportArticleById } from '@/lib/articles';
import { reportInputSchema } from '@/lib/validation';

// Intentionally public/unauthenticated — reporting a piece of content
// shouldn't require an account. The reason is validated but not currently
// persisted anywhere beyond a bumped counter (same as before); wire up a
// separate `reports` table if you want to review individual reasons later.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    reportInputSchema.parse(body);

    const reports = await reportArticleById(id);
    if (reports === null) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Article reported successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid report data', details: error.flatten() }, { status: 400 });
    }
    console.error('Error reporting article:', error);
    return NextResponse.json({ error: 'Failed to report article' }, { status: 500 });
  }
}
