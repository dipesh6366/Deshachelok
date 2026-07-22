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

  // Real-time Marathi clock - exact same as homepage
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSelectedDateStr(getMarathiDateString(now));
      setCurrentTime(getMarathiTimeString(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-350 text-xs py-2 px-4 shadow-sm border-b border-slate-800 select-none">
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

          {/* Small profile icon only (no Write Article button) */}
          {!isLoading && isAuthenticated && (
            <div className="flex items-center gap-2 ml-4">
              <Link
                href="/editor/dashboard"
                title="Dashboard"
                className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold hover:bg-blue-200 transition-colors"
              >
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </Link>
              <button
                onClick={logout}
                className="p-2 text-neutral-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
