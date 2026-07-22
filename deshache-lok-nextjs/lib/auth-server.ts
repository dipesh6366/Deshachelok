import { NextRequest } from 'next/server';
import { verifyIdToken } from './firebaseAdmin';

export type AuthenticatedUser = {
  uid: string;
  email: string | null;
};

// Comma-separated list of emails that can see/edit/delete every article,
// not just their own. Set via SUPER_ADMIN_EMAILS in .env.local — server-side
// only, so it can't be read or spoofed from the client.
function getSuperAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return getSuperAdminEmails().includes(email.toLowerCase());
}

/**
 * Verifies the `Authorization: Bearer <idToken>` header against Firebase.
 * Returns the authenticated user, or null if the header is missing/invalid.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const header = req.headers.get('authorization') || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return null;

  try {
    const decoded = await verifyIdToken(match[1]);
    return { uid: decoded.uid, email: decoded.email || null };
  } catch {
    return null;
  }
}

/** True if `user` owns `authorId`, or is a super admin. */
export function canManageArticle(user: AuthenticatedUser, authorId: string | null | undefined): boolean {
  if (isSuperAdmin(user.email)) return true;
  return !!authorId && authorId === user.uid;
}
