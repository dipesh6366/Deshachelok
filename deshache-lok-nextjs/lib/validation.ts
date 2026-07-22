import { z } from 'zod';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Normalizes whatever the editor typed into a valid, URL-safe slug instead
// of hard-rejecting anything that isn't already lowercase-hyphenated ASCII
// (the editor UI lets you free-type this field, and this app's content is
// mostly Marathi, so headlines/slugs won't naturally be ASCII).
const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(200)
  .transform(slugify)
  .refine((s) => s.length > 0, 'Slug must contain at least one letter or number (a-z, 0-9)');

const optionalUrlField = z.union([z.string().trim().url().max(2000), z.literal('')]).optional();

// Fields the client is allowed to set when creating/updating an article.
// Notably excludes: id, authorId, authorEmail, views, reports, createdAt,
// updatedAt, publishedAt — those are always derived server-side so a
// caller can't spoof authorship or inflate their own view count.
export const articleInputSchema = z.object({
  headline: z.string().trim().min(1, 'Headline is required').max(300),
  subtitle: z.string().trim().max(500).optional().default(''),
  summary: z.string().trim().max(1000).optional().default(''),
  content: z.string().trim().min(1, 'Content is required').max(50_000),
  seoTitle: z.string().trim().max(200).optional().default(''),
  seoDescription: z.string().trim().max(300).optional().default(''),
  keywords: z
    .array(z.string().trim())
    .max(20)
    .optional()
    .default([])
    .transform((arr) => arr.filter(Boolean)),
  slug: slugField,
  imageUrl: optionalUrlField,
  altText: z.string().trim().max(300).optional(),
  imageCaption: z.string().trim().max(300).optional(),
  status: z.enum(['draft', 'published']),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

// Partial version for PUT (patch semantics) — same field rules, all optional.
export const articleUpdateSchema = articleInputSchema.partial();

export const enhanceInputSchema = z.object({
  rawContent: z.string().trim().min(1, 'rawContent is required').max(20_000),
  imageUrl: optionalUrlField,
});

export const reportInputSchema = z.object({
  reason: z.string().trim().max(1000).optional().default(''),
});
