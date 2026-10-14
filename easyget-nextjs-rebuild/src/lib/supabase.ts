import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase is optional while this app runs on mock data (see src/lib/products.ts).
 * Once a Supabase project exists, set NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example) and this client will be
 * live — nothing else in the app needs to change to start reading from the
 * `products` / `orders` tables defined in supabase/schema.sql.
 */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
