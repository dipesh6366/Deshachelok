import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

const appUrl = process.env.APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'देशाचे लोक - Deshache Lok',
  description: 'An AI-Enhanced Digital Newspaper platform.',
  openGraph: {
    title: 'देशाचे लोक - Deshache Lok',
    description: 'An AI-Enhanced Digital Newspaper platform.',
    type: 'website',
    siteName: 'देशाचे लोक',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

