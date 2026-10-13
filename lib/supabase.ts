import { createClient, Session, User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function signInAdmin(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!supabase) {
    return { user: null, error: 'Supabase client is not configured' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return { user: data.user, error: null }
}

export async function signOutAdmin(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error: error ? error.message : null }
}

export async function getAdminSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}
