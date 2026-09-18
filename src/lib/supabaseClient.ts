import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe retrieval across Vite (import.meta.env) and Next.js / Node (process.env)
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://jkdwpnmcnidfftebypet.supabase.co';

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase URL or Anon Key. Please verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

/**
 * Client-side Supabase instance.
 * Safe for browser execution, client components, and public reads/writes governed by RLS.
 * STRICTLY NEVER EXPOSES SUPABASE_SERVICE_ROLE_KEY.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
