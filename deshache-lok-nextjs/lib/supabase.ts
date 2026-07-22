import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE ROLE key and must never be imported into a
// client component or exposed to the browser. It is only ever used from
// Route Handlers (app/api/**) and Server Components, which run on the
// server. Row Level Security can stay simple/locked-down on the `articles`
// table since all reads/writes go through our own API routes, not directly
// from the browser.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local (see .env.example).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
