'use client';

import Link from 'next/link';
import { Newspaper, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-white border-b-4 border-red-700 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Matching Homepage Style */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-red-700 text-white p-3 rounded-lg">
              <Newspaper size={28} />
            </div>
            <div>
              <span className="font-serif font-black text-4xl tracking-tight text-gray-900">
                देशाचे लोक
              </span>
              <p className="text-xs text-red-800 font-medium -mt-1">
                सार्वभौमिक व पुरोगामी
              </p>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <Link
                    href="/editor/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 transition-colors"
                  >
                    <PenTool size={18} />
                    Write Article
                  </Link>

                  <Link
                    href="/editor/dashboard"
                    title="Dashboard"
                    className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold hover:bg-red-200 transition-colors"
                  >
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </Link>

                  <button
                    onClick={logout}
                    className="p-3 text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link
                  href="/editor/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 transition-colors"
                >
                  <PenTool size={18} />
                  Write Article
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
