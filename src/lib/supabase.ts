import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables will be replaced with actual values during build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log the Supabase URL (for debugging)
console.log('Initializing Supabase client with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
