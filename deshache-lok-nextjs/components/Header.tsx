'use client';

import Link from 'next/link';
import { Newspaper, PenTool, LogOut, Clock, Calendar, User } from 'lucide-react';
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
    <>
      {/* 1. TOP UTILITY HEADER RAIL - Exact same as homepage */}
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
            <Link
              href="/editor/dashboard"
              className="p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-400 hover:text-white ml-2"
              title="Editorial Login"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BRAND MASTHEAD PLATE - Exact same as homepage */}
      <header className="max-w-7xl mx-auto px-4 py-6 text-center select-none">
        <Link href="/" className="inline-block cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-1">
            <h1 className="font-serif font-black text-5xl md:text-6xl tracking-tight text-gray-900 hover:scale-[1.01] transition-transform duration-300">
              देशाचे लोक
            </h1>
            <p className="text-xs md:text-sm font-serif font-medium text-red-800 tracking-wider">
              सार्वभौमिक व पुरोगामी विचारांचे अग्रगण्य मराठी वृत्त व्यासपीठ
            </p>
          </div>
        </Link>

        {/* Double Border Plate Info Strip */}
        <div className="news-border-double news-border-top-double mt-5 py-2.5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 font-semibold gap-3">
          <div>पुणे, मुंबई आणि संपूर्ण महाराष्ट्र</div>
          <div className="font-serif italic text-gray-500">&quot;समृद्ध विचारांचा लोकपंथ&quot;</div>
          <div>डिजिटल आवृत्ती • विनामूल्य</div>
        </div>

        {/* Editor controls */}
        <div className="flex justify-end mt-4">
          {!isLoading && (
            isAuthenticated ? (
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
                  className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold ml-3 hover:bg-blue-200 transition-colors"
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors ml-2"
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
            )
          )}
        </div>
      </header>
    </>
  );
}
