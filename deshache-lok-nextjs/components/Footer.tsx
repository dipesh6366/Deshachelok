'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} देशाचे लोक. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-neutral-600">
          <Link href="/terms" className="hover:text-neutral-900 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/content-policy" className="hover:text-neutral-900 transition-colors">
            Content Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
