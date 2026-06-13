import { createClient } from '@supabase/supabase-js';

// These should be set in your .env file
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge function base URL
export const FUNCTIONS_URL = `${supabaseUrl}/functions/v1`;
