'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { ArrowLeft, Eye, Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle, Flag } from 'lucide-react';
import { incrementArticleViews, reportArticle } from '@/lib/api';
import { Article } from '@/lib/types';

export default function ArticleClient({ article: initialArticle }: { article: Article }) {
  const [article, setArticle] = useState(initialArticle);
  const [reportState, setReportState] = useState<'idle' | 'reporting' | 'reported'>('idle');
  const [reportReason, setReportReason] = useState('');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    incrementArticleViews(initialArticle.id)
      .then(({ views }) => setArticle((prev) => ({ ...prev, views })))
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArticle.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setReportState('reporting');
    try {
      await reportArticle(article.id, reportReason);
      setReportState('reported');
      setReportReason('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please try again later.');
      setReportState('idle');
    }
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight mb-4">
          {article.headline}
        </h1>
        {article.subtitle && (
          <h2 className="text-lg text-neutral-600 leading-relaxed font-normal mb-6">{article.subtitle}</h2>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-neutral-200 mt-6">
          <div className="flex flex-col gap-2">
            {article.authorEmail && (
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {article.authorEmail[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-neutral-800">{article.authorEmail}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-500 font-medium">
              <span>{article.publishedAt && format(new Date(article.publishedAt), 'MMMM d, yyyy • h:mm a')}</span>
              <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-full">
                <Eye size={14} />
                <span>{article.views || 0} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-500 mr-2 flex items-center gap-1">
              <Share2 size={14} /> Share
            </span>
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 text-neutral-700 transition-colors"
            >
              <LinkIcon size={16} />
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#E8F8F5] rounded-full hover:bg-[#D1F2EB] text-[#128C7E] transition-colors"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.headline)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#EBF5FF] rounded-full hover:bg-[#DBEAFE] text-[#1DA1F2] transition-colors"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#EEF2FF] rounded-full hover:bg-[#E0E7FF] text-[#4267B2] transition-colors"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>

      {article.imageUrl && (
        <figure className="mb-12">
          <div className="rounded-2xl overflow-hidden bg-neutral-100">
            <img
              src={article.imageUrl}
              alt={article.altText || article.headline}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="text-sm text-neutral-500 mt-3 text-center italic">{article.imageCaption}</figcaption>
          )}
        </figure>
      )}

      <div className="prose prose-lg prose-neutral max-w-none leading-relaxed prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-neutral-800 prose-blockquote:bg-neutral-50 prose-blockquote:p-4 prose-blockquote:text-neutral-800 prose-blockquote:not-italic rounded-lg prose-li:marker:text-neutral-500">
        <Markdown>{article.content}</Markdown>
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-200">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to all news
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-200 bg-neutral-50 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Flag size={16} className="text-red-500" /> Report this article
            </h4>
            <p className="text-xs text-neutral-500 mt-1">If you think this content violates our community guidelines, let us know.</p>
          </div>
          {reportState === 'idle' && (
            <button
              onClick={() => setReportState('reporting')}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
            >
              Report
            </button>
          )}
        </div>

        {reportState === 'reporting' && (
          <form onSubmit={handleReport} className="mt-4 pt-4 border-t border-neutral-200">
            <label htmlFor="reportReason" className="block text-sm font-medium text-neutral-700 mb-2">
              Reason for reporting
            </label>
            <textarea
              id="reportReason"
              rows={3}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              placeholder="Please provide details about how this violates our policies..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              required
            />
            <div className="mt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReportState('idle')}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reportReason.trim()}
                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}

        {reportState === 'reported' && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 text-sm rounded-md border border-green-200">
            Thank you. Your report has been submitted for review.
          </div>
        )}
      </div>
    </article>
  );
}
