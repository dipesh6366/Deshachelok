# देशाचे लोक (Deshache Lok) — Next.js + Supabase

An AI-Enhanced Digital Newspaper platform. Originally a Vite + Express +
react-router-dom app (exported from Google AI Studio), converted to
**Next.js (App Router)**, backed by **Supabase (Postgres)** for storage, and
deployed for free on **Vercel**.

## Why Vercel + Supabase

- **Vercel** is built by the Next.js team — SSR, Route Handlers, and image/edge
  optimizations work with zero config, and the free Hobby tier (100GB
  bandwidth/month, unlimited projects, no forced cold-start sleep) comfortably
  covers a small newspaper site.
- **Supabase** gives a free hosted Postgres database (500MB on the free tier),
  which replaces the prototype's in-memory data store so articles actually
  persist across deploys and server restarts.

## One-time setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project (free tier is fine).
2. Once it's created, open **SQL Editor** → New query, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the
   `articles` table, the view/report counter functions, and seeds the demo
   article.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (not the `anon` key) → `SUPABASE_SERVICE_ROLE_KEY`

   The service-role key is used server-side only (`lib/supabase.ts`, imported
   only by Route Handlers and Server Components) — it's never sent to the
   browser, so it's safe to use even though it bypasses Row Level Security.

### 2. Firebase Auth setup

The app uses Firebase Auth for sign-in, and Firebase Admin server-side to
verify who's calling the API (see "Production readiness" below for why that
matters).

1. **Client config** — Firebase Console → Project Settings → General → Your
   apps → SDK setup and configuration → Config. Copy the values into the
   `NEXT_PUBLIC_FIREBASE_*` vars.
2. **Admin service account** — Firebase Console → Project Settings → Service
   Accounts → Generate new private key. This downloads a JSON file; copy
   `project_id`, `client_email`, and `private_key` into `FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`. Keep the `\n`
   sequences in the private key literal — most hosts (including Vercel)
   handle a multi-line value fine if you paste it in quotes exactly as it
   appears in the JSON file.
3. **Super admins** (optional) — set `SUPER_ADMIN_EMAILS` to a comma-separated
   list of emails that should be able to manage every article, not just
   their own.

### 3. Get a Gemini API key

Grab one from [Google AI Studio](https://aistudio.google.com/) for the
`GEMINI_API_KEY` used by the "Enhance with AI" editor feature.

### 4. Local development

```
npm install
cp .env.example .env.local
# fill in every var in .env.local — see the comments in .env.example
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. On vercel.com, **New Project** → import the repo. Vercel auto-detects
   Next.js — no build config needed.
3. Add every environment variable from `.env.local` under **Project Settings
   → Environment Variables**, and set `APP_URL` to your Vercel URL (e.g.
   `https://your-app.vercel.app`) once you know it.
4. Deploy. Every push to your main branch redeploys automatically.

## What changed in the Next.js conversion

- **Routing**: `react-router-dom` routes → Next.js file-based routing under `app/`.
- **SEO / social meta tags**: the old `server.ts` manually read `index.html`,
  string-replaced `<!-- APP_TITLE -->` / `<!-- APP_META -->`, and built an
  Open Graph / Twitter / JSON-LD block by hand for `/article/:slug`. That's
  now handled natively by Next's `generateMetadata()` in
  `app/article/[slug]/page.tsx`.
- **Server**: the Express server (`server.ts`) is gone. Its REST endpoints
  became Next.js Route Handlers under `app/api/**`; its Gemini `/api/enhance`
  logic moved into `app/api/enhance/route.ts` (server-only, so
  `GEMINI_API_KEY` is never exposed to the browser).
- **Data fetching**: `Home` and the article page read from Supabase directly
  on the server (no client-side fetch waterfall + loading spinner).
  `Dashboard` and `Editor` remain client components that call the
  `/api/articles/*` routes for mutations.
- **Auth**: Firebase Auth logic in `lib/AuthContext.tsx` is unchanged (still
  client-side, via `'use client'`). The old `ProtectedRoute` component became
  `components/AuthGate.tsx`. Only the *database* moved to Supabase — sign-in
  is still handled by Firebase Auth.

## What changed moving from the in-memory store to Supabase

- `lib/store.ts` (a `globalThis`-backed in-memory array) is gone, replaced by
  `lib/articles.ts` — a small data-access layer that maps Supabase's
  snake_case rows to the app's camelCase `Article` type and exposes the same
  shape of functions (`getAllArticles`, `getArticleBySlug`, `createArticle`,
  `updateArticle`, `deleteArticleById`, `incrementArticleViews`,
  `reportArticleById`).
- View and report counters are incremented **atomically** in Postgres via two
  small `plpgsql` functions (`increment_article_views`,
  `increment_article_reports` in `supabase/schema.sql`), called through
  `supabase.rpc(...)`, instead of read-then-write in application code.
- No other files needed to change — the API routes, pages, and components all
  called `lib/store.ts` through a handful of functions, and `lib/articles.ts`
  keeps the same function names and return types.

## Project Structure

```
app/
  layout.tsx                 Root layout (html/body, Providers, global metadata — NO header/footer)
  page.tsx                   Home (server component, reads Supabase, renders Homepage)
  error.tsx, not-found.tsx, global-error.tsx    Error/404 boundaries
  robots.ts, sitemap.ts       SEO metadata routes
  (site)/                    Route group: every page EXCEPT the homepage
    layout.tsx                Header + Footer wrap everything in this group
    article/[slug]/
      page.tsx                 Article page + generateMetadata (SEO/OG/Twitter/JSON-LD)
      ArticleClient.tsx         Interactive share/report/view-tracking (client)
      loading.tsx               Loading skeleton
    editor/
      new/page.tsx              New article (behind AuthGate)
      edit/[id]/page.tsx        Edit article (behind AuthGate)
      dashboard/page.tsx        Editorial dashboard (behind AuthGate)
    terms/page.tsx, privacy/page.tsx, content-policy/page.tsx
  api/
    articles/route.ts                    GET (own articles)/POST (auth required)
    articles/[id]/route.ts               GET/PUT/DELETE (auth + ownership required)
    articles/[id]/view/route.ts          POST (public, increment views)
    articles/[id]/report/route.ts        POST (public, report article)
    articles/slug/[slug]/route.ts        GET (public, published-only)
    enhance/route.ts                     POST (auth required, Gemini AI enhancement)
components/
  Header.tsx, Footer.tsx     Generic site chrome, only rendered inside (site)
  home/
    Homepage.tsx               Newspaper-style homepage (own masthead + footer)
    BreakingNewsTicker.tsx, OpinionPollCard.tsx
  AuthGate.tsx, DashboardView.tsx, EditorForm.tsx
lib/
  firebaseClient.ts  Firebase client SDK init (client, env-configured)
  firebaseAdmin.ts    Firebase Admin SDK init (server-only)
  auth-server.ts       Verifies request auth + ownership/admin checks (server-only)
  validation.ts         Zod schemas for API request bodies
  AuthContext.tsx   Firebase auth context (client)
  api.ts            Client-side fetch helpers, attach auth tokens (server-only header)
  articles.ts        Supabase data-access layer (server-only)
  supabase.ts        Supabase client (service-role, server-only)
  dateUtils.ts        Marathi date/time formatting for the homepage
  types.ts           Shared Article type
supabase/
  schema.sql         Table, RLS, RPC functions, and seed data
```

### Why the homepage doesn't use the global Header/Footer

The homepage has its own newspaper-style masthead and footer
(`components/home/Homepage.tsx`), so it doesn't want the generic
`Header`/`Footer` from `components/`. The `(site)` route group makes this a
structural fact rather than a runtime one: `app/page.tsx` (the homepage) sits
*outside* `(site)`, so `Header`/`Footer` — which only live in
`app/(site)/layout.tsx` — are never part of its component tree. Every other
route (`/article/...`, `/editor/...`, `/terms`, etc.) lives inside `(site)`
and gets them automatically. Route groups don't affect the URL, so
`/article/some-slug` still resolves exactly as before.

An earlier version of this used a `usePathname() === '/'` check inside
`Header`/`Footer` to hide them on the homepage at runtime instead. That's
fragile — it depends on the hook re-evaluating correctly on every client-side
navigation, and can end up "stuck" showing both the homepage's own chrome and
the global one after navigating away and back. Route groups avoid the whole
class of bug by making it impossible for both to render at once.

## Production readiness

An earlier version of this app had no server-side authorization at all — the
`AuthGate` component only hid the *editor UI* behind login; the underlying
`/api/articles/**` routes had no auth check, so anyone who found the URL
could `curl` a `POST`/`PUT`/`DELETE` directly, and `GET /api/articles` was
public and returned every draft (including unpublished content from other
authors) to any visitor. That's fixed now:

- **Every mutating route requires auth.** `lib/firebaseAdmin.ts` verifies the
  Firebase ID token sent as `Authorization: Bearer <token>`
  (`lib/auth-server.ts#getAuthenticatedUser`). `lib/api.ts` attaches that
  header automatically for the client calls that need it (create/update/
  delete/list/enhance) — public calls (view increment, report, published-slug
  lookup) don't send one.
- **Ownership is enforced server-side**, not just hidden in the UI.
  `lib/auth-server.ts#canManageArticle` checks that the caller owns the
  article (`authorId` from the verified token) or is listed in
  `SUPER_ADMIN_EMAILS` (a server-only env var — there's no hardcoded admin
  email in client code anymore).
- **`authorId`/`authorEmail` are always derived from the verified token**,
  never taken from the request body — a caller can't create or reassign an
  article to impersonate someone else.
- **`GET /api/articles` is authenticated and scoped** to the caller's own
  articles (or every article, for a super admin) — it's no longer a public
  endpoint that leaks drafts. `DashboardView.tsx` no longer needs (or has)
  the old client-side ownership-guessing logic; the server returns the
  correct set directly.
- **Drafts are unreachable by URL.** Both `/article/[slug]` and
  `GET /api/articles/slug/[slug]` now 404 for anything that isn't
  `status: 'published'`, closing off a way to view/index unpublished content
  just by knowing or guessing its slug.
- **`/api/enhance` requires auth** and caps `rawContent` length — it calls a
  paid Gemini API, so it shouldn't be callable by an anonymous visitor.
- **Input validation** via `zod` (`lib/validation.ts`) on every API route
  that accepts a body — malformed requests get a `400` with details instead
  of an opaque `500` or, worse, silently writing bad data. The slug field is
  auto-normalized (lowercased, non-alphanumerics collapsed to hyphens) rather
  than hard-rejecting non-ASCII input, since this app's content is Marathi.
- **Slug collisions return `409`** with a clear message instead of a raw
  Postgres error surfacing as a `500`.
- **Firebase client config lives in `NEXT_PUBLIC_*` env vars**, not hardcoded
  in source — the same code can point at different Firebase projects per
  environment, and `lib/firebaseClient.ts` centralizes the init so it can't
  accidentally run twice (which throws in the Firebase SDK).
- **Security headers** (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, a locked-down `Permissions-Policy`) are set on every
  response via `next.config.ts`.
- **`robots.ts` and `sitemap.ts`** — the sitemap lists every published
  article dynamically from Supabase; `robots.txt` disallows crawling
  `/editor/*`.
- **Error boundaries and a 404 page** (`app/error.tsx`,
  `app/global-error.tsx`, `app/not-found.tsx`) so an unexpected error or bad
  URL shows a real page instead of a blank screen or Next's default error
  overlay in production.

### Still worth doing before real traffic

- **Rate limiting** — there isn't any yet (e.g. on `/api/enhance` or article
  creation). Fine at low volume; worth adding via Vercel's built-in rate
  limiting or a small Upstash Redis-backed limiter if abuse becomes a
  concern.
- **A real `reports` table** — reports currently just increment a counter,
  with no record of who reported what or why. Add a table if you want to
  actually review individual reports.
- **Automated tests** — none exist yet. At minimum, testing the auth/ownership
  branches in `app/api/articles/**` (a request without a token, with someone
  else's token, etc.) would catch regressions in the part of the app where a
  regression is most costly.
- **Structured server-side logging/monitoring** — errors currently just go to
  `console.error`, which Vercel captures in its function logs, but there's no
  alerting. Worth wiring up Sentry (or similar) once this is live.

## Notes / next steps

- Row Level Security is enabled on `articles` with no policies, since all
  reads/writes go through the service-role key from server-side code. If you
  later want the browser to talk to Supabase directly (e.g. real-time
  updates), you'll need to add RLS policies and switch those calls to the
  `anon` key.
- Report submissions currently just increment a counter (`reports`), same as
  the original prototype — there's no separate reports table with reasons.
  Add one if you want to review individual report reasons later.
- The home page and article pages use ISR (`revalidate = 60` — cached for up
  to 60 seconds) rather than fetching from Supabase on every request. Creating,
  editing, and deleting articles (`app/api/articles/**`) also call
  `revalidatePath()` on the affected page(s) so changes show up immediately
  instead of waiting out the 60s window. View/report counts are intentionally
  *not* revalidated on every hit — they'd defeat the point of caching — so a
  cached article page's view count can lag by up to a minute; the client-side
  `ArticleClient` component still shows the live count it gets back from the
  `/view` call itself.
