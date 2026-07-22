-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- for your project before deploying.

create table if not exists articles (
  id text primary key,
  headline text not null default '',
  subtitle text not null default '',
  summary text not null default '',
  content text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  keywords text[] not null default '{}',
  slug text not null unique,
  image_url text,
  alt_text text,
  image_caption text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  views integer not null default 0,
  reports integer not null default 0,
  author_id text,
  author_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  published_at timestamptz
);

create index if not exists articles_slug_idx on articles (slug);
create index if not exists articles_status_idx on articles (status);
create index if not exists articles_published_at_idx on articles (published_at desc);

-- Row Level Security: locked down by default. The app only ever talks to
-- this table via the Supabase service-role key from server-side Next.js
-- code (Route Handlers / Server Components), which bypasses RLS entirely.
-- Enabling RLS with no policies just makes sure nothing can read/write
-- this table directly from the browser with the anon key, in case that key
-- is ever introduced later.
alter table articles enable row level security;

-- Atomic view/report counters, called via supabase.rpc(...) from lib/articles.ts
create or replace function increment_article_views(article_id text)
returns integer
language plpgsql
as $$
declare
  new_views integer;
begin
  update articles set views = coalesce(views, 0) + 1
  where id = article_id
  returning views into new_views;

  return new_views;
end;
$$;

create or replace function increment_article_reports(article_id text)
returns integer
language plpgsql
as $$
declare
  new_reports integer;
begin
  update articles set reports = coalesce(reports, 0) + 1
  where id = article_id
  returning reports into new_reports;

  return new_reports;
end;
$$;

-- Seed data (same demo article the original prototype shipped with)
insert into articles (
  id, headline, subtitle, summary, content, seo_title, seo_description,
  keywords, slug, image_url, alt_text, image_caption, status, views,
  author_id, author_email, created_at, published_at
) values (
  'demo-article',
  'The Future of AI in Digital Journalism',
  'How artificial intelligence is transforming the way we write and consume news.',
  'As AI tools become more integrated into newsrooms, journalists are finding new ways to speed up the editorial process without sacrificing quality.',
  E'## A New Era for News\n\nArtificial intelligence has officially entered the newsroom. With platforms like **देशाचे लोक**, editors can focus on the core journalistic investigation rather than the mundane formatting.\n\n> "AI will not replace journalists, but journalists who use AI will replace those who don''t."\n\nThe adoption of AI allows single-person editorial teams to punch far above their weight, generating metadata, formatting articles, and drafting summaries in seconds.',
  'The Future of AI in Digital Journalism | देशाचे लोक',
  'How artificial intelligence is transforming the way we write and consume news.',
  array['AI', 'Journalism', 'Digital News', 'Future', 'Technology'],
  'future-of-ai-journalism',
  'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3',
  'A laptop showing digital code representing AI',
  'Artificial Intelligence in the Newsroom.',
  'published',
  1042,
  'demo-admin-id',
  'admin@deshachelok.com',
  now(),
  now()
)
on conflict (id) do nothing;
