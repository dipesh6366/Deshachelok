import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import { Article } from './types';

// This module is the single place that talks to the `articles` table.
// It maps between Supabase's snake_case rows and the app's camelCase
// Article type, so nothing else in the app needs to know the DB schema.

export class SlugConflictError extends Error {
  constructor(slug: string) {
    super(`The slug "${slug}" is already in use by another article.`);
    this.name = 'SlugConflictError';
  }
}

// Postgres' unique_violation error code.
const UNIQUE_VIOLATION = '23505';


type ArticleRow = {
  id: string;
  headline: string;
  subtitle: string;
  summary: string;
  content: string;
  seo_title: string;
  seo_description: string;
  keywords: string[] | null;
  slug: string;
  image_url: string | null;
  alt_text: string | null;
  image_caption: string | null;
  status: 'draft' | 'published';
  views: number | null;
  reports: number | null;
  author_id: string | null;
  author_email: string | null;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
};

function fromRow(row: ArticleRow): Article {
  return {
    id: row.id,
    headline: row.headline,
    subtitle: row.subtitle,
    summary: row.summary,
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    keywords: row.keywords || [],
    slug: row.slug,
    imageUrl: row.image_url || undefined,
    altText: row.alt_text || undefined,
    imageCaption: row.image_caption || undefined,
    status: row.status,
    views: row.views || 0,
    reports: row.reports || undefined,
    authorId: row.author_id || undefined,
    authorEmail: row.author_email || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at || undefined,
    publishedAt: row.published_at,
  };
}

function toRow(article: Partial<Article>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (article.id !== undefined) row.id = article.id;
  if (article.headline !== undefined) row.headline = article.headline;
  if (article.subtitle !== undefined) row.subtitle = article.subtitle;
  if (article.summary !== undefined) row.summary = article.summary;
  if (article.content !== undefined) row.content = article.content;
  if (article.seoTitle !== undefined) row.seo_title = article.seoTitle;
  if (article.seoDescription !== undefined) row.seo_description = article.seoDescription;
  if (article.keywords !== undefined) row.keywords = article.keywords;
  if (article.slug !== undefined) row.slug = article.slug;
  if (article.imageUrl !== undefined) row.image_url = article.imageUrl;
  if (article.altText !== undefined) row.alt_text = article.altText;
  if (article.imageCaption !== undefined) row.image_caption = article.imageCaption;
  if (article.status !== undefined) row.status = article.status;
  if (article.views !== undefined) row.views = article.views;
  if (article.authorId !== undefined) row.author_id = article.authorId;
  if (article.authorEmail !== undefined) row.author_email = article.authorEmail;
  if (article.createdAt !== undefined) row.created_at = article.createdAt;
  if (article.updatedAt !== undefined) row.updated_at = article.updatedAt;
  if (article.publishedAt !== undefined) row.published_at = article.publishedAt;
  return row;
}

export async function getArticlesByAuthor(authorId: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ArticleRow[]).map(fromRow);
}

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ArticleRow[]).map(fromRow);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data as ArticleRow[]).map(fromRow);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as ArticleRow) : null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as ArticleRow) : null;
}

export async function createArticle(article: Partial<Article>): Promise<Article> {
  const now = new Date().toISOString();
  const row = toRow({
    ...article,
    id: article.id || uuidv4(),
    views: 0,
    createdAt: article.createdAt || now,
    publishedAt: article.publishedAt || (article.status === 'published' ? now : null),
  });
  const { data, error } = await supabase.from('articles').insert(row).select().single();
  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new SlugConflictError(String(row.slug));
    throw error;
  }
  return fromRow(data as ArticleRow);
}

export async function updateArticle(id: string, patch: Partial<Article>): Promise<Article | null> {
  const row = toRow({ ...patch, updatedAt: new Date().toISOString() });
  const { data, error } = await supabase.from('articles').update(row).eq('id', id).select().maybeSingle();
  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new SlugConflictError(String(row.slug));
    throw error;
  }
  return data ? fromRow(data as ArticleRow) : null;
}

export async function deleteArticleById(id: string): Promise<boolean> {
  const { data, error } = await supabase.from('articles').delete().eq('id', id).select().maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function incrementArticleViews(id: string): Promise<number | null> {
  const { data, error } = await supabase.rpc('increment_article_views', { article_id: id });
  if (error) throw error;
  return data ?? null;
}

export async function reportArticleById(id: string): Promise<number | null> {
  const { data, error } = await supabase.rpc('increment_article_reports', { article_id: id });
  if (error) throw error;
  return data ?? null;
}
