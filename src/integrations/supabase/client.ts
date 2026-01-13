import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Support both public and legacy variable names to avoid silent misconfiguration.
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL
  ?? import.meta.env.VITE_SUPABASE_URL
  ?? 'https://placeholder-project.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
  ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  ?? 'placeholder-key';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
