import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read all potential environment variable keys from Vite and Vercel Supabase integration
const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  '';

// Guard against the old dead project URL
const isOldDeadUrl = rawUrl.includes('rkfdynnmhuhupfdghnsb');

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  !isOldDeadUrl &&
  rawKey
);

const SUPABASE_URL = isSupabaseConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
