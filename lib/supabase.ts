import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client
  if (!isSupabaseConfigured()) return null
  _client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
