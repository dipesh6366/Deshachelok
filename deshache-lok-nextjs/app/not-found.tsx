import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-neutral-900">Page not found</h1>
        <p className="text-neutral-500">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
