import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Also allow local storage override for easy preview/runtime configuration
const STORAGE_URL_KEY = 'whisper_supabase_url';
const STORAGE_KEY_KEY = 'whisper_supabase_anon_key';

export function getSupabaseCredentials() {
  let url = envUrl;
  let anonKey = envKey;

  if (typeof window !== 'undefined') {
    try {
      const storedUrl = localStorage.getItem(STORAGE_URL_KEY);
      const storedKey = localStorage.getItem(STORAGE_KEY_KEY);
      if (storedUrl) url = storedUrl;
      if (storedKey) anonKey = storedKey;
    } catch {
      // ignore
    }
  }

  return {
    url: (url || '').trim(),
    anonKey: (anonKey || '').trim(),
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function saveSupabaseCredentials(url, anonKey) {
  if (typeof window === 'undefined') return;
  try {
    if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
    else localStorage.removeItem(STORAGE_URL_KEY);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);

    // Recreate singleton
    supabaseInstance = null;
  } catch {
    // ignore
  }
}

let supabaseInstance = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSupabaseCredentials();

  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
        realtime: {
          params: {
            eventsPerSecond: 20,
          },
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }

  // Fallback dummy client if credentials are not configured yet (prevents crash)
  return null;
}

export const supabase = getSupabase();

/**
 * Storage upload helper for Supabase Storage buckets with public URL generation
 */
export async function uploadToSupabaseStorage(bucketName, file, pathPrefix = '') {
  const client = getSupabase();
  if (!client || !file) return null;

  try {
    const ext = file.name ? file.name.split('.').pop() : 'png';
    const filename = `${pathPrefix ? pathPrefix + '/' : ''}${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await client.storage
      .from(bucketName)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = client.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase storage exception:', err);
    return null;
  }
}
