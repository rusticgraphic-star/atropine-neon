import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://thspxdhdumlqkexsebqx.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_RvgaTrABOQagpzEDPsJ-iw_CT9nnng0';

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(rawUrl && rawKey);

export const supabase = createClient<Database>(rawUrl, rawKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
