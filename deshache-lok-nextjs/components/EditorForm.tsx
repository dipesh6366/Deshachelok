'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Save, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fetchArticle, saveArticle, enhanceArticle } from '@/lib/api';
import { Article } from '@/lib/types';

export default function EditorForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!articleId);
  const [enhancing, setEnhancing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rawContent, setRawContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [article, setArticle] = useState<Partial<Article>>({
    headline: '',
    subtitle: '',
    summary: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    keywords: [],
    slug: '',
    status: 'draft',
  });

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId)
        .then((found) => {
          setArticle(found);
          setRawContent(found.content || '');
          setImageUrl(found.imageUrl || '');
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [articleId]);

  const handleEnhance = async () => {
    if (!rawContent.trim()) return;

    setEnhancing(true);
    try {
      const enhanced = await enhanceArticle(rawContent, imageUrl);
      setArticle((prev) => ({
        ...prev,
        ...enhanced,
        imageUrl: imageUrl || prev.imageUrl,
      }));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to enhance article. Please check your server configuration.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      // authorId/authorEmail are derived server-side from the verified
      // auth token (see app/api/articles/route.ts) — not sent from here.
      const finalArticle = {
        ...article,
        status,
        imageUrl,
      };
      const saved = await saveArticle(finalArticle);
      router.push(status === 'published' ? `/article/${saved.slug}` : '/editor/dashboard');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-neutral-500">Loading editor...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input (Raw Content & AI Tool) */}
        <div className="flex flex-col h-[calc(100vh-12rem)] border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
            <h2 className="font-semibold text-neutral-800">Raw Content Input</h2>
          </div>

          <div className="p-4 border-b border-neutral-100 flex gap-4">
            <div className="flex-1 flex items-center gap-2 border border-neutral-300 rounded-md px-3 py-2">
              <ImageIcon size={18} className="text-neutral-400" />
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full text-sm focus:outline-none bg-transparent"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          <textarea
            className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 font-mono text-sm leading-relaxed text-neutral-800"
            placeholder="Paste your raw article notes, rough draft, or transcript here..."
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
          />

          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <button
              onClick={handleEnhance}
              disabled={enhancing || !rawContent.trim()}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {enhancing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  AI is analyzing and writing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Enhance with AI
                </>
              )}
            </button>
            <p className="text-xs text-center text-neutral-500 mt-3">
              AI will generate headline, formatting, summaries, and SEO metadata automatically.
            </p>
          </div>
        </div>

        {/* Right Column: Output (Structured Content & Meta) */}
        <div className="flex flex-col h-[calc(100vh-12rem)] border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
            <h2 className="font-semibold text-neutral-800">Final Article Review</h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving || !article.headline}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                <Save size={16} /> Save Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving || !article.headline}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 shadow-sm transition-colors"
              >
                <Globe size={16} /> Publish
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            {!article.headline && !article.content ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p>Awaiting AI enhancement...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Headline</label>
                  <input
                    type="text"
                    value={article.headline || ''}
                    onChange={(e) => setArticle({ ...article, headline: e.target.value })}
                    className="w-full font-bold text-2xl p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Subtitle</label>
                  <textarea
                    value={article.subtitle || ''}
                    onChange={(e) => setArticle({ ...article, subtitle: e.target.value })}
                    className="w-full text-lg p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20"
                  />
                </div>

                {imageUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Featured Image</label>
                    <div className="relative rounded-lg overflow-hidden border border-neutral-200">
                      <img src={imageUrl} alt={article.altText || 'Featured'} className="w-full h-48 object-cover" />
                    </div>
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={article.imageCaption || ''}
                        onChange={(e) => setArticle({ ...article, imageCaption: e.target.value })}
                        placeholder="Caption"
                        className="w-full text-sm p-2 border border-neutral-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={article.altText || ''}
                        onChange={(e) => setArticle({ ...article, altText: e.target.value })}
                        placeholder="Alt text"
                        className="w-full text-sm p-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Content (Markdown)</label>
                  <textarea
                    value={article.content || ''}
                    onChange={(e) => setArticle({ ...article, content: e.target.value })}
                    className="w-full p-3 font-mono text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-96"
                  />
                </div>

                <div className="bg-white p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">SEO & Metadata</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">Summary (Meta Description)</label>
                      <textarea
                        value={article.summary || ''}
                        onChange={(e) => setArticle({ ...article, summary: e.target.value })}
                        className="w-full text-sm p-2 border border-neutral-300 rounded-md h-20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={article.slug || ''}
                          onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                          className="w-full text-sm p-2 border border-neutral-300 rounded-md bg-neutral-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Keywords</label>
                        <input
                          type="text"
                          value={article.keywords?.join(', ') || ''}
                          onChange={(e) => setArticle({ ...article, keywords: e.target.value.split(',').map((s) => s.trim()) })}
                          className="w-full text-sm p-2 border border-neutral-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
