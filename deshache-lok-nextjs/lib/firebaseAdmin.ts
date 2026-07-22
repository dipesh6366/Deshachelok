import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Server-only. Verifies the ID tokens the client SDK issues, so API routes
// can trust who's calling them instead of taking authorId/authorEmail on
// faith from the request body.

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY. ' +
        'Generate a service account key in Firebase Console → Project Settings → ' +
        'Service Accounts, and set these in .env.local (see .env.example).'
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export async function verifyIdToken(idToken: string) {
  const auth = getAuth(getAdminApp());
  return auth.verifyIdToken(idToken);
}
