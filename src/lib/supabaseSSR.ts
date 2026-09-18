/**
 * Supabase Next.js App Router & Server Components Helper
 * 
 * If using @supabase/ssr in Next.js App Router:
 * - createServerClient(supabaseUrl, supabaseAnonKey, { cookies })
 * 
 * This file provides standard patterns for Next.js App Router, Route Handlers,
 * and Server Actions while ensuring SUPABASE_SERVICE_ROLE_KEY is never exposed.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkdwpnmcnidfftebypet.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

/**
 * Creates a server-side client for Next.js Route Handlers / Server Components
 * using the public anon key and an optional user auth bearer token.
 */
export function createServerComponentClient(token?: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}

/**
 * Creates an admin client using the secret service_role key.
 * Strictly restricted to server contexts (Route handlers, cron jobs, webhook handlers).
 */
export function createServerActionAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY cannot be accessed on the client side.');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_nK0V_f1RJOgDvlMI177TEA_5TBv-PCd';

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
