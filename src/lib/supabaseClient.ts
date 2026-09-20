import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jkdwpnmcnidfftebypet.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export default supabase;
