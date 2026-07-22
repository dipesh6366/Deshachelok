'use client';

import Link from 'next/link';
import { Newspaper, User, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getMarathiDateString, getMarathiTimeString } from '@/lib/dateUtils';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Real-time Marathi clock like homepage
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSelectedDateStr(getMarathiDateString(now));
      setCurrentTime(getMarathiTimeString(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-700">
      {/* Top Utility Bar - EXACT same as Homepage */}
      <div className="bg-slate-900 text-slate-350 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-red-500 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-900/30">
              आवृत्ती: डिजिटल विशेष
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {selectedDateStr}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-white font-mono font-bold">
              <Clock className="h-3 w-3 text-red-400 animate-pulse" />
              {currentTime}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              सत्यशोधक व पारदर्शक पत्रकारिता
            </span>

            {/* Profile Icon - Right side like Homepage */}
            {!isLoading && isAuthenticated && (
              <Link
                href="/editor/dashboard"
                className="p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-400 hover:text-white ml-2"
                title="Editorial Dashboard"
              >
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-red-700 text-white p-3 rounded-lg">
              <Newspaper size={32} />
            </div>
            <div>
              <h1 className="font-serif font-black text-4xl md:text-5xl tracking-tighter text-white group-hover:text-red-400 transition-colors">
                देशाचे लोक
              </h1>
              <p className="text-xs md:text-sm font-medium text-slate-400 tracking-widest">
                सार्वभौमिक व पुरोगामी विचारांचे अग्रगण्य मराठी वृत्त व्यासपीठ
              </p>
            </div>
          </Link>

          {/* Right Side - Write Article Button (for guests) */}
          {!isLoading && !isAuthenticated && (
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium transition-all"
            >
              लेख लिहा
            </Link>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-red-700 via-amber-600 to-red-700" />
    </header>
  );
}
