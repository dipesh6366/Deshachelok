import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase's client config is not a secret — it's safe to ship in the
// browser bundle — but it's sourced from env vars (rather than hardcoded)
// so the same code can point at different Firebase projects per
// environment (local/staging/prod) without a code change.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID. Set the NEXT_PUBLIC_FIREBASE_* vars (see .env.example).'
  );
}

// getApps()/getApp() guards against "Firebase App named '[DEFAULT]' already
// exists" errors, which happen if this module is evaluated more than once
// (e.g. Fast Refresh in dev, or being imported from more than one entry
// point on the client).
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
