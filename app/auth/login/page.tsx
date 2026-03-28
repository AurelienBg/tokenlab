'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/projects')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      // redirect handled by OAuth callback
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur Google OAuth'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo + title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <TokenlabIcon />
          </div>
          <h1 className="text-xl font-bold text-foreground">Tokenlab</h1>
          <p className="text-sm text-muted mt-1">
            {mode === 'signin' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        <div className="card space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-ghost w-full gap-2"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                autoFocus
                className="input"
              />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? '8 caractères minimum' : '••••••••'}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                className="input"
              />
            </div>

            {error && (
              <p className="text-xs text-red bg-red/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <SpinnerIcon /> Chargement…
                </span>
              ) : mode === 'signin' ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-xs text-center text-muted">
            {mode === 'signin' ? (
              <>Pas encore de compte ?{' '}
                <button onClick={() => { setMode('signup'); setError('') }} className="text-accent hover:underline font-medium">
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>Déjà un compte ?{' '}
                <button onClick={() => { setMode('signin'); setError('') }} className="text-accent hover:underline font-medium">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-xs text-center text-muted mt-6">
          <Link href="/projects" className="hover:text-foreground transition-colors">
            ← Continuer sans compte
          </Link>
        </p>
      </div>
    </div>
  )
}

function TokenlabIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="#7C3AED" strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="6" fill="#7C3AED" opacity="0.2"/>
      <circle cx="11" cy="11" r="3" fill="#7C3AED"/>
      <path d="M11 1 L11 4 M11 18 L11 21 M1 11 L4 11 M18 11 L21 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
