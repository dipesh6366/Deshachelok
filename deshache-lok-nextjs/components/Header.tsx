'use client';

import Link from 'next/link';
import { LogOut, Clock, Calendar, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getMarathiDateString, getMarathiTimeString } from '@/lib/dateUtils';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [selectedDateStr, setSelectedDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSelectedDateStr(getMarathiDateString(now));
      setCurrentTime(getMarathiTimeString(now));
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 shadow-sm border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-red-500 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-900/30">
            आवृत्ती: डिजिटल विशेष
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {selectedDateStr || "\u00A0"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-white font-mono font-bold">
            <Clock className="h-3 w-3 text-red-400 animate-pulse" />
            {currentTime || "\u00A0"}
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
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
