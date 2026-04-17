import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ojcenrwpblofljausypx.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY não configurada no .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
