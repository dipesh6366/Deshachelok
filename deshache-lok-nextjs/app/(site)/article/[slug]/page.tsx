import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticleBySlug } from '@/lib/articles';
import ArticleClient from './ArticleClient';

export const revalidate = 60;

const appUrl = process.env.APP_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    return { title: 'Article not found | देशाचे लोक' };
  }

  const title = `${article.seoTitle || article.headline} | देशाचे लोक`;
  const description = article.seoDescription || article.summary;
  const imageUrl = article.imageUrl;

  return {
    title,
    description,
    alternates: {
      canonical: `${appUrl}/article/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'देशाचे लोक',
      url: `${appUrl}/article/${article.slug}`,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: article.altText || article.headline }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // Drafts are treated as not-found for anyone browsing directly — this
  // isn't a "preview" system, so an unpublished article shouldn't be
  // publicly reachable just because someone knows/guesses its slug.
  if (!article || article.status !== 'published') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Article not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.seoTitle || article.headline,
    image: article.imageUrl ? [article.imageUrl] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: [{ '@type': 'Organization', name: 'देशाचे लोक', url: appUrl }],
    publisher: { '@type': 'Organization', name: 'देशाचे लोक' },
    description: article.seoDescription || article.summary,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ArticleClient article={article} />
    </>
  );
}
