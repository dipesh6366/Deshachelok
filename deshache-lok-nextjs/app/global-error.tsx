'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-neutral-500">
            An unexpected error occurred. You can try again, or head back to the home page.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
