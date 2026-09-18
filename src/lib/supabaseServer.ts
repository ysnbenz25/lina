import { createClient, SupabaseClient } from '@supabase/supabase-js';

let serverClientInstance: SupabaseClient | null = null;

/**
 * Server-only Supabase admin client.
 * Uses SUPABASE_SERVICE_ROLE_KEY with full admin privileges (bypasses RLS).
 * 
 * CRITICAL SECURITY RULE:
 * This function and SUPABASE_SERVICE_ROLE_KEY MUST ONLY be called from:
 * - Server Components (Next.js App Router)
 * - Server Actions
 * - Route Handlers (app/api/.../route.ts or pages/api/...)
 * - Express backend endpoints (server.ts)
 * 
 * NEVER call or export this client to browser or client components ('use client').
 */
export function getSupabaseServerAdmin(): SupabaseClient {
  // Hard barrier: Prevent execution in any browser context
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: getSupabaseServerAdmin() was called in a client/browser environment. The SUPABASE_SERVICE_ROLE_KEY must remain strictly server-side.');
  }

  if (!serverClientInstance) {
    const supabaseUrl = 
      process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.SUPABASE_URL ||
      'https://jkdwpnmcnidfftebypet.supabase.co';

    const serviceRoleKey = 
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      'sb_secret_nK0V_f1RJOgDvlMI177TEA_5TBv-PCd';

    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable on the server.');
    }

    if (!serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable on the server.');
    }

    serverClientInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serverClientInstance;
}

/**
 * Convenience server-side client getter for regular user requests (respects RLS)
 * using the anon key or user JWT token on the server.
 */
export function createServerSupabaseClient(jwtToken?: string): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: createServerSupabaseClient() called in browser.');
  }

  const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.SUPABASE_URL ||
    'https://jkdwpnmcnidfftebypet.supabase.co';

  const anonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
    },
  });
}
