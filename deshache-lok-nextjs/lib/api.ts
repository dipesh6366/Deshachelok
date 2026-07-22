import { Article } from './types';
import { auth } from './firebaseClient';

// Attaches the current user's Firebase ID token as a Bearer header for
// routes that require auth server-side (see lib/auth-server.ts). Throws if
// there's no signed-in user, so callers fail fast with a clear message
// instead of the server silently returning 401.
async function authHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to do this.');
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

// Requires auth — returns only the current user's own articles (or every
// article, for a super admin). See app/api/articles/route.ts.
export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch('/api/articles', { headers: await authHeaders() });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to fetch articles'));
  return res.json();
}

// Requires auth + ownership (or super admin).
export async function fetchArticle(id: string): Promise<Article> {
  const res = await fetch(`/api/articles/${id}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to fetch article'));
  return res.json();
}

// Public — only ever returns published articles.
export async function fetchArticleBySlug(slug: string): Promise<Article> {
  const res = await fetch(`/api/articles/slug/${slug}`);
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to fetch article'));
  return res.json();
}

// Requires auth + ownership (or super admin).
export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`/api/articles/${id}`, { method: 'DELETE', headers: await authHeaders() });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to delete article'));
}

// Public.
export async function incrementArticleViews(id: string): Promise<{ views: number }> {
  const res = await fetch(`/api/articles/${id}/view`, { method: 'POST' });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to increment views'));
  return res.json();
}

// Public.
export async function reportArticle(id: string, reason: string): Promise<void> {
  const res = await fetch(`/api/articles/${id}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to report article'));
}

// Requires auth. Author fields are derived server-side from the verified
// token, so they don't need to (and can't usefully) be sent from here.
export async function saveArticle(article: Partial<Article>): Promise<Article> {
  const isNew = !article.id;
  const res = await fetch(isNew ? '/api/articles' : `/api/articles/${article.id}`, {
    method: isNew ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(article),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to save article'));
  return res.json();
}

// Requires auth — calls a paid API server-side, so it must not be callable
// by anyone who isn't signed in.
export async function enhanceArticle(rawContent: string, imageUrl?: string): Promise<Partial<Article>> {
  const res = await fetch('/api/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ rawContent, imageUrl }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Failed to enhance article'));
  return res.json();
}
