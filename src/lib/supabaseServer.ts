import { createClient, SupabaseClient } from '@supabase/supabase-js';

let serverClientInstance: SupabaseClient | null = null;

export function getSupabaseServerAdmin(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY VIOLATION: getSupabaseServerAdmin() was called in the browser.'
    );
  }

  if (!serverClientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    }

    if (!serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }

    serverClientInstance = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return serverClientInstance;
}

export function createServerSupabaseClient(
  jwtToken?: string
): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY VIOLATION: createServerSupabaseClient() called in browser.'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: jwtToken
        ? { Authorization: `Bearer ${jwtToken}` }
        : {},
    },
  });
}
