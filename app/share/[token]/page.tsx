'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { decodeShareToken } from '@/lib/share'
import { saveLocalProject, getLocalProject } from '@/lib/storage'
import { LocalProject } from '@/lib/types'
import { MODULES } from '@/lib/constants'
import { computeHealthScore } from '@/lib/healthScore'

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const [lp, setLp] = useState<LocalProject | null>(null)
  const [invalid, setInvalid] = useState(false)
  const [imported, setImported] = useState(false)

  useEffect(() => {
    const token = params.token as string
    const decoded = decodeShareToken(token)
    if (!decoded) {
      setInvalid(true)
      return
    }
    setLp(decoded)
    // Check if already imported
    if (getLocalProject(decoded.project.id)) setImported(true)
  }, [params.token])

  function handleImport() {
    if (!lp) return
    saveLocalProject(lp.project)
    setImported(true)
    setTimeout(() => router.push(`/project/${lp.project.id}/dashboard`), 600)
  }

  if (invalid) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-2xl mb-2">⬡</p>
        <h1 className="text-lg font-semibold text-foreground mb-1">Lien invalide</h1>
        <p className="text-sm text-muted mb-4">Ce lien de partage est introuvable ou corrompu.</p>
        <Link href="/projects" className="btn btn-primary">Mes projets</Link>
      </div>
    </div>
  )

  if (!lp) return (
    <div className="min-h-screen flex items-center justify-center">
      <svg className="animate-spin text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  )

  const { project, modules } = lp
  const health = computeHealthScore(modules)
  const completedCount = MODULES.filter((m) => modules[m.key]?.is_complete).length

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-surface px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#7C3AED" strokeWidth="1.5"/>
            <circle cx="11" cy="11" r="6" fill="#7C3AED" opacity="0.2"/>
            <circle cx="11" cy="11" r="3" fill="#7C3AED"/>
            <path d="M11 1L11 4M11 18L11 21M1 11L4 11M18 11L21 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-bold text-sm text-foreground">Tokenlab</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted hidden sm:block">Partagé en lecture seule</span>
          <Link href="/projects/new" className="btn btn-primary text-xs">
            Créer mon projet
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Project header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-muted mt-1 max-w-lg">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {project.blockchain && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded">{project.blockchain}</span>
                )}
                {project.project_type && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded">{project.project_type.replace(/_/g, ' ')}</span>
                )}
                {project.project_stage && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded capitalize">{project.project_stage}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={imported}
              className={`btn shrink-0 ${imported ? 'btn-ghost text-green' : 'btn-primary'}`}
            >
              {imported ? '✓ Importé' : '⬇ Importer dans Tokenlab'}
            </button>
          </div>
        </div>

        {/* Score + progress */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card col-span-1 flex flex-col items-center justify-center py-6">
            <div className={`text-4xl font-bold mb-1 ${
              health.total >= 70 ? 'text-green' :
              health.total >= 40 ? 'text-yellow' : 'text-red'
            }`}>
              {health.total}
            </div>
            <div className="text-xs text-muted uppercase tracking-wider">Score santé</div>
            <div className="text-xs text-muted mt-1">/ 100</div>
          </div>
          <div className="card col-span-2 flex flex-col justify-center py-5 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progression</span>
              <span className="text-sm font-semibold text-foreground">{completedCount}/{MODULES.length}</span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${Math.round((completedCount / MODULES.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {Math.round((completedCount / MODULES.length) * 100)}% des modules complétés
            </p>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Modules</h2>
          <ul className="space-y-2">
            {MODULES.map((m) => {
              const mod = modules[m.key]
              const done = mod?.is_complete ?? false
              const hasData = !!mod
              return (
                <li key={m.key} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    done ? 'bg-green/20 text-green' :
                    hasData ? 'bg-yellow/20 text-yellow' : 'bg-surface-2 text-muted'
                  }`}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : hasData ? (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="2"/></svg>
                    ) : (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="2" opacity="0.4"/></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{m.label}</p>
                    <p className="text-xs text-muted">{m.description}</p>
                  </div>
                  <span className={`text-[10px] font-medium shrink-0 ${
                    done ? 'text-green' : hasData ? 'text-yellow' : 'text-muted'
                  }`}>
                    {done ? 'Complet' : hasData ? 'En cours' : 'Vide'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Structuré avec{' '}
          <Link href="/" className="text-accent hover:underline">Tokenlab</Link>
          {' '}— le workshop tokenomics post-session
        </p>
      </div>
    </div>
  )
}
