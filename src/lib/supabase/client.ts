import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'drive-socal-pov/1.0.0',
    },
  },
});

// Database helper functions
export const createSupabaseClient = (options?: {
  auth?: {
    persistSession?: boolean;
    autoRefreshToken?: boolean;
  };
}) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    ...options,
  });
};

// Realtime subscriptions
export const subscribeToRealtime = <T extends Record<string, any>>(
  table: string,
  _callback: (payload: { new: T; old: T; eventType: string }) => void,
  _filter?: string
) => {
  const channel = supabase.channel(`${table}_changes`);

  // Simple subscription without type conflicts
  // TODO: Implement proper realtime subscription when Supabase types are resolved
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log(`Subscribed to ${table} changes`);
    }
  });

  return channel;
};

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signInWithOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers with error handling
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage?: string
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Database query error:', error);
      return { data: null, error: error.message || errorMessage || 'Database error occurred' };
    }
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected database error:', err);
    return { data: null, error: errorMessage || 'Unexpected error occurred' };
  }
};