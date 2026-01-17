import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Support both public and legacy variable names to avoid silent misconfiguration.
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL
  ?? import.meta.env.VITE_SUPABASE_URL
  ?? '';

const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
  ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  ?? '';

const missingSupabaseConfig = !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY;

if (missingSupabaseConfig) {
  // Fail fast so we don't hit 401s or placeholder endpoints in production.
  throw new Error('Supabase environment variables are missing. Set VITE_PUBLIC_SUPABASE_URL and VITE_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
