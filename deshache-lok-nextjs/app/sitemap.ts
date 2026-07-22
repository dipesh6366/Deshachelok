import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/articles';

const appUrl = process.env.APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, changeFrequency: 'hourly', priority: 1 },
    { url: `${appUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${appUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${appUrl}/content-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${appUrl}/article/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt || article.createdAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
