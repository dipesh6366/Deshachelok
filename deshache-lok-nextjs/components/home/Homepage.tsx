"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, CloudSun, Clock, Calendar, User } from "lucide-react";
import { Article } from "@/lib/types";
import { getMarathiDateString, getMarathiTimeString, formatMarathiArticleDate } from "@/lib/dateUtils";
import { BreakingNewsTicker } from "./BreakingNewsTicker";
import { OpinionPollCard } from "./OpinionPollCard";

// Static demo data — there's no `weather` table/API wired up yet.
const weatherCities = [
  { city: "मुंबई", temp: 31, condition: "अंशतः ढगाळ", icon: "🌤" },
  { city: "पुणे", temp: 28, condition: "ढगाळ", icon: "☁" },
  { city: "नागपूर", temp: 41, condition: "निरभ्र", icon: "☀" },
  { city: "च. संभाजीनगर", temp: 34, condition: "पावसाळी", icon: "🌦" },
];

function authorLabel(article: Article): string {
  if (article.authorEmail) {
    const name = article.authorEmail.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return "संपादकीय टीम";
}

interface HomepageProps {
  articles: Article[];
}

const Homepage: React.FC<HomepageProps> = ({ articles }) => {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");

  // Real-time Marathi running clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSelectedDateStr(getMarathiDateString(now));
      setCurrentTime(getMarathiTimeString(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleViewArticle = (art: Article) => {
    router.push(`/article/${art.slug}`);
  };

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">अद्याप कोणतीही बातमी प्रकाशित नाही.</h2>
        <p className="text-neutral-500">लवकरच नवीन बातम्या इथे दिसतील.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfa] text-slate-800 font-sans selection:bg-red-700 selection:text-white pb-12">

      {/* 1. TOP UTILITY HEADER RAIL */}
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

      {/* 2. BRAND MASTHEAD PLATE - Traditional Double Rulers */}
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
          <div>पुणे, मुंबई आणि संपूर्ण महाराष्ट्र • वर्ष १ • अंक ७२</div>
          <div className="font-serif italic text-gray-500">&quot;समृद्ध विचारांचा लोकपंथ&quot;</div>
          <div>डिजिटल कल्पकता: siteget.in • विनामूल्य आवृत्ती</div>
        </div>
      </header>

      {/* 3. BREAKING NEWS TICKER */}
      <section className="max-w-7xl mx-auto px-4">
        <BreakingNewsTicker articles={articles.slice(0, 8)} onSelectArticle={handleViewArticle} />
      </section>

      {/* 4. MAIN CONTENT BLOCK */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT 2 COLUMNS: FEATURED & FEED NEWS */}
          <div className="lg:col-span-2 space-y-8">

            <div className="border-b-2 border-red-700 pb-2 flex items-center justify-between select-none">
              <h2 className="font-serif font-black text-xl text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-700 animate-pulse" />
                प्रथम मुखपृष्ठ घडामोडी
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                आत्ताचे ताजे अपडेट्स
              </div>
            </div>

            <div className="space-y-6">
              {/* 1. Hero Card - latest article */}
              <article
                className="bg-white group cursor-pointer border-b border-gray-200 pb-6"
                onClick={() => handleViewArticle(articles[0])}
              >
                <div className="w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden mb-4 bg-neutral-100">
                  {articles[0].imageUrl ? (
                    <img
                      src={articles[0].imageUrl}
                      alt={articles[0].altText || articles[0].headline}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <span className="text-lg font-medium">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="font-sans font-black text-gray-900 text-[28px] md:text-[36px] leading-[1.2] group-hover:text-red-700 transition-colors tracking-tight">
                    {articles[0].headline}
                  </h3>
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium py-1">
                    <span className="flex items-center gap-1 text-gray-700 bg-gray-100 rounded-full px-2 py-0.5">
                      <User className="w-3 h-3" /> {authorLabel(articles[0])}
                    </span>
                    <span>•</span>
                    <span>{formatMarathiArticleDate(articles[0].publishedAt)}</span>
                  </div>
                  <p className="text-[16px] text-gray-600 font-serif leading-[1.6] line-clamp-3">
                    {articles[0].summary}
                  </p>
                </div>
              </article>

              {/* 2. Medium Featured Cards - next 3 */}
              {articles.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-gray-200 pb-6">
                  {articles.slice(1, 4).map((art) => (
                    <article
                      key={art.id}
                      className="bg-white group cursor-pointer flex flex-col"
                      onClick={() => handleViewArticle(art)}
                    >
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-neutral-100">
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            alt={art.altText || art.headline}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No image</div>
                        )}
                      </div>
                      <h4 className="font-sans font-bold text-gray-900 text-[18px] leading-[1.3] line-clamp-3 group-hover:text-red-700 transition-colors mb-2">
                        {art.headline}
                      </h4>
                      <div className="mt-auto flex items-center gap-2 text-[11px] text-gray-500 font-medium pt-2">
                        <span className="truncate max-w-[60%] flex items-center gap-1">
                          <User className="w-3 h-3" /> {authorLabel(art)}
                        </span>
                        <span>•</span>
                        <span>{formatMarathiArticleDate(art.publishedAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* 3. Compact Horizontal Cards - next 3 */}
              {articles.length > 4 && (
                <div className="space-y-6 border-b border-gray-200 pb-6">
                  {articles.slice(4, 7).map((art) => (
                    <article
                      key={art.id}
                      className="group flex gap-4 bg-white items-start cursor-pointer"
                      onClick={() => handleViewArticle(art)}
                    >
                      <div className="w-[120px] h-[80px] md:w-[200px] md:h-[130px] shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            alt={art.altText || art.headline}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-bold text-gray-900 text-[16px] md:text-[20px] leading-[1.3] line-clamp-3 group-hover:text-red-700 transition-colors mb-2">
                          {art.headline}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] md:text-[12px] text-gray-500 font-medium">
                          <span className="truncate flex items-center gap-1">
                            <User className="w-3 h-3" /> {authorLabel(art)}
                          </span>
                          <span>•</span>
                          <span>{formatMarathiArticleDate(art.publishedAt)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* 4. Headline Lists - rest, paginated with Load More */}
              {articles.length > 7 && (
                <div className="space-y-5">
                  {articles.slice(7, Math.max(7, visibleCount)).map((art) => (
                    <article
                      key={art.id}
                      className="group bg-white flex flex-col justify-center cursor-pointer border-b border-gray-150 last:border-0 pb-5"
                      onClick={() => handleViewArticle(art)}
                    >
                      <h4 className="font-sans font-bold text-gray-900 text-[16px] md:text-[18px] leading-[1.35] line-clamp-2 group-hover:text-red-700 transition-colors mb-1.5">
                        {art.headline}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {authorLabel(art)}
                        </span>
                        <span>•</span>
                        <span>{formatMarathiArticleDate(art.publishedAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Load More Button */}
            {articles.length > visibleCount && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center min-w-[150px]"
                >
                  आणखी बातम्या पहा (See More)
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-8 lg:sticky lg:top-4">

            {/* REGIONAL MAHARASHTRA WEATHER GRID */}
            <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4 select-none">
                <h4 className="font-serif font-bold text-gray-900 flex items-center gap-1.5">
                  <CloudSun className="h-5 w-5 text-sky-600" />
                  हवामान वृत्त
                </h4>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  तपशीलवार
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {weatherCities.map((c, i) => (
                  <div key={i} className="bg-slate-50 border border-gray-150 p-2.5 rounded-lg text-center space-y-0.5 select-none">
                    <span className="text-xs font-serif font-bold text-gray-800 block">{c.city}</span>
                    <span className="text-base font-mono font-bold text-orange-600 block">{c.temp}°C {c.icon}</span>
                    <span className="text-[10px] text-gray-500 block truncate font-medium font-serif">{c.condition}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 font-serif italic text-center mt-3 select-none">
                *निदर्शक हवामान आकडेवारी.
              </div>
            </div>

            {/* OPINION POLL */}
            <OpinionPollCard />

          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-16 pt-8 max-w-7xl mx-auto px-4 text-center select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-150 pb-8 text-sm text-gray-500">
          <div className="space-y-2">
            <h5 className="font-serif font-black text-gray-800 uppercase tracking-widest text-xs">देशाचे लोक</h5>
            <p className="text-xs font-serif leading-relaxed text-justify md:text-center text-gray-600">
              प्रत्येक मराठी मनाचा आवाज, महाराष्ट्रातील अस्सल घडामोडी, कृषी क्रांती, क्रीडा व संपन्न संस्कृतीचे साक्षीदार. आम्ही सत्य आणि केवळ सत्य शोधण्याचे व्रत अंगीकारले आहे.
            </p>
          </div>
          <div className="space-y-2 select-auto">
            <h5 className="font-serif font-black text-gray-800 uppercase tracking-widest text-xs">महत्त्वाचे दुवे</h5>
            <div className="flex flex-col items-center gap-1.5 text-xs">
              <Link href="/terms" className="text-gray-600 hover:text-red-700 transition-colors">Terms &amp; Conditions</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-red-700 transition-colors">Privacy Policy</Link>
              <Link href="/content-policy" className="text-gray-600 hover:text-red-700 transition-colors">Content Policy</Link>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-serif font-black text-gray-800 uppercase tracking-widest text-xs">डिजिटल हब</h5>
            <p className="text-xs text-gray-600 leading-relaxed text-justify md:text-center">
              आमच्याशी जुडून राहण्यासाठी आणि ताज्या घडामोडी मिळवण्यासाठी नियमित भेट द्या.
            </p>
          </div>
        </div>

        <div className="pt-6 text-xs text-gray-400 font-semibold uppercase tracking-wider space-y-1">
          <p>© {new Date().getFullYear()} देशाचे लोक (siteget.in). सर्व हक्क सुरक्षित.</p>
        </div>
      </footer>

    </div>
  );
};

export default Homepage;
