import type { MetadataRoute } from 'next';

const appUrl = process.env.APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The editor/dashboard routes require login anyway, but keep
        // crawlers from wasting time trying and from indexing them.
        disallow: ['/editor/'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
