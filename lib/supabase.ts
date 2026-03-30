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

const noop = new Proxy(
  (() => Promise.resolve({ data: null, error: new Error('Supabase not configured') })) as unknown as SupabaseClient,
  { get(t, p) { return p in t ? (t as unknown as Record<string|symbol,unknown>)[p] : noop } }
)

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    if (!client) return (noop as unknown as Record<string|symbol,unknown>)[prop]
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
