'use client';

import Link from 'next/link';
import { Newspaper, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded">
                <Newspaper size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">देशाचे लोक</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading &&
              (isAuthenticated ? (
                <>
                  <Link
                    href="/editor/new"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <PenTool size={16} />
                    Write Article
                  </Link>
                  <Link
                    href="/editor/dashboard"
                    title="Dashboard"
                    className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold ml-2 hover:bg-blue-200 transition-colors"
                  >
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link
                  href="/editor/new"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PenTool size={16} />
                  Write Article
                </Link>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
