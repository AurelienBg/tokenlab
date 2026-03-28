'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLocalProjects, deleteLocalProject } from '@/lib/storage'
import { Project } from '@/lib/types'
import { MODULES } from '@/lib/constants'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getLocalProjects())
  }, [])

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce projet ?')) return
    deleteLocalProject(id)
    setProjects(getLocalProjects())
  }

  function completedCount(p: Project): number {
    return MODULES.filter((m) => p.completed_modules & (1 << MODULES.indexOf(m))).length
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes projets</h1>
          <p className="text-sm text-muted mt-1">Structurez votre tokenomics post-workshop</p>
        </div>
        <Link href="/projects/new" className="btn btn-primary">
          + Nouveau projet
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-4">🪙</div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Aucun projet</h2>
          <p className="text-sm text-muted mb-6">
            Créez votre premier projet pour commencer à structurer votre tokenomics.
          </p>
          <Link href="/projects/new" className="btn btn-primary">
            Créer un projet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => {
            const completed = completedCount(p)
            const total = MODULES.length
            const pct = Math.round((completed / total) * 100)
            return (
              <div key={p.id} className="card hover:border-accent/40 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/project/${p.id}/dashboard`}
                        className="text-base font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        {p.name}
                      </Link>
                      {p.token_ticker && (
                        <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded">
                          ${p.token_ticker}
                        </span>
                      )}
                      {p.project_type && (
                        <span className="text-xs text-muted bg-surface-hover px-2 py-0.5 rounded">
                          {projectTypeLabel(p.project_type)}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-sm text-muted truncate">{p.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex-1 max-w-[200px]">
                        <div className="flex items-center justify-between text-xs text-muted mb-1">
                          <span>Progression</span>
                          <span>{completed}/{total} modules</span>
                        </div>
                        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      {p.health_score > 0 && (
                        <div className="text-xs text-muted">
                          Score : <span className={`font-semibold ${
                            p.health_score >= 70 ? 'text-green' :
                            p.health_score >= 40 ? 'text-yellow' : 'text-red'
                          }`}>{p.health_score}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/project/${p.id}/dashboard`}
                      className="btn btn-ghost text-xs"
                    >
                      Ouvrir
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-ghost text-xs text-red hover:text-red hover:border-red/30"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function projectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    web3_native: 'Web3 natif',
    web2_to_web3: 'Web2 → Web3',
    dao: 'DAO',
    rwa: 'RWA',
    social_impact: 'Social Impact',
  }
  return labels[type] || type
}
