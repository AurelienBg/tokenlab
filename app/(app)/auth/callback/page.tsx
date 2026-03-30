'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')

    async function handleCallback() {
      try {
        if (code) {
          // PKCE flow: exchange the code for a session
          await supabase.auth.exchangeCodeForSession(code)
        } else {
          // Implicit flow / existing session: check current session
          await supabase.auth.getSession()
        }
      } catch {
        // ignore errors — still redirect
      } finally {
        router.replace('/projects')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm text-muted">Signing in…</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
