import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types.ts'
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from '@/env.ts'

// Supabase client configuration
// Uses environment variables from .env.local for local development
// For production, set these in your hosting platform's environment variables
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
