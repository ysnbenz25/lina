import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return { url, key };
}

export function createServerComponentClient(
  token?: string
): SupabaseClient {
  const { url, key } = getConfig();

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    },
  });
}

export function createServerActionAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY cannot be accessed on the client'
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
