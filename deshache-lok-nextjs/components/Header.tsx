'use client';

import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getMarathiDateString } from '@/lib/dateUtils';
import { useEffect, useState } from 'react';

export default function Header() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [selectedDateStr, setSelectedDateStr] = useState("");

  useEffect(() => {
    const updateDate = () => setSelectedDateStr(getMarathiDateString(new Date()));
    updateDate(); // Initial call
    const timer = setInterval(updateDate, 1000 * 30); // date only needs to tick occasionally
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 shadow-sm border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2">
        {/* Logo + edition tag */}
        <Link href="/" className="flex flex-col items-start gap-1 shrink-0">
          <span className="font-serif font-black text-xl text-white tracking-tight">
            देशाचे लोक
          </span>
          <span className="font-mono text-[10px] text-red-500 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-900/30">
            आवृत्ती: डिजिटल विशेष
          </span>
        </Link>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {selectedDateStr || "\u00A0"}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            सत्यशोधक व पारदर्शक पत्रकारिता
          </span>

          {/* Profile icon - always visible, same as homepage */}
          <Link
            href="/editor/dashboard"
            title="Dashboard"
            className="p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-400 hover:text-white ml-2"
          >
            <User className="h-4 w-4" />
          </Link>

          {/* Logout - only for logged in users */}
          {!isLoading && isAuthenticated && (
            <button
              onClick={logout}
              className="text-[10px] text-neutral-400 hover:text-white transition-colors underline ml-1"
              title="Logout"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
