import { createClient } from '@supabase/supabase-js';

// Resolve Supabase project URL from any available environment source (Vite, Next, Process)
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const procEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl: string =
  metaEnv?.VITE_SUPABASE_URL ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  procEnv?.VITE_SUPABASE_URL ||
  procEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  procEnv?.SUPABASE_URL ||
  'https://jkdwpnmcnidfftebypet.supabase.co';

const supabaseAnonKey: string =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  procEnv?.VITE_SUPABASE_ANON_KEY ||
  procEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  procEnv?.SUPABASE_ANON_KEY ||
  'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

console.info('[Supabase Client] Initialized with endpoint:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
