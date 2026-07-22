'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit, FileText, CheckCircle, Trash2, Eye, PlusCircle } from 'lucide-react';
import { fetchArticles, deleteArticle } from '@/lib/api';
import { Article } from '@/lib/types';
import { useAuth } from '@/lib/AuthContext';

export default function DashboardView() {
  // GET /api/articles is authenticated and already scoped server-side to
  // the current user's own articles (or every article, for a super admin)
  // — see app/api/articles/route.ts — so there's no client-side ownership
  // filtering to do here.
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        setArticles(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalViews = useMemo(() => articles.reduce((sum, article) => sum + (article.views || 0), 0), [articles]);
  const publishedCount = useMemo(() => articles.filter((a) => a.status === 'published').length, [articles]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        setArticles(articles.filter((a) => a.id !== id));
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'Failed to delete article');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Editorial Dashboard</h1>
          <p className="text-neutral-500 mt-1">Manage your profile, articles, and drafts.</p>
        </div>
        <Link
          href="/editor/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Write Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Logged in as</p>
            <p className="text-neutral-900 font-semibold truncate max-w-[200px]">{user?.email}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Published Articles</p>
            <p className="text-2xl font-bold text-neutral-900">{publishedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Total Views</p>
            <p className="text-2xl font-bold text-neutral-900">{totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">No articles</h3>
          <p className="mt-1 text-neutral-500 mb-6">You haven&apos;t written any articles yet.</p>
          <Link
            href="/editor/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Write New Article
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-hidden border border-neutral-200 sm:rounded-xl">
          <ul className="divide-y divide-neutral-200">
            {articles.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-lg font-semibold text-neutral-900 truncate">{article.headline || 'Untitled Draft'}</h4>
                      <p className="mt-1 flex items-center text-sm text-neutral-500">{article.slug || 'No slug generated'}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-4 items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {article.status === 'published' ? <CheckCircle size={12} className="mr-1" /> : <Edit size={12} className="mr-1" />}
                        {article.status}
                      </span>
                      <Link href={`/editor/edit/${article.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-neutral-500">
                        Created {format(new Date(article.createdAt), 'MMM d, yyyy')}
                        <span className="mx-2">&bull;</span>
                        <Eye size={14} className="mr-1" /> {article.views || 0} views
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
