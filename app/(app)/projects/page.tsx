'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLocalProjects, deleteLocalProject } from '@/lib/storage'
import { Project } from '@/lib/types'
import { MODULES } from '@/lib/constants'
import { useLang } from '@/components/LangProvider'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const { t } = useLang()

  useEffect(() => {
    setProjects(getLocalProjects())
  }, [])

  function handleDelete(id: string) {
    deleteLocalProject(id)
    setProjects(getLocalProjects())
    setConfirmDelete(null)
  }

  function completedCount(p: Project): number {
    return MODULES.filter((m) => p.completed_modules & (1 << MODULES.indexOf(m))).length
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.projectsTitle}</h1>
          <p className="text-sm text-muted mt-1">{t.projectsSubtitle}</p>
        </div>
        <Link href="/projects/new" className="btn btn-primary">
          {t.newProject}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-4">🪙</div>
          <h2 className="text-lg font-semibold text-foreground mb-2">{t.noProjectsYet}</h2>
          <p className="text-sm text-muted mb-6 max-w-xs mx-auto">{t.noProjectsDesc}</p>
          <Link href="/projects/new" className="btn btn-primary">
            {t.createProject}
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
                          <span>{t.progressLabel}</span>
                          <span>{completed}/{total}</span>
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
                          {t.scoreLabel} : <span className={`font-semibold ${
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
                      {t.open}
                    </Link>
                    {confirmDelete === p.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn text-xs bg-red/10 text-red border border-red/30 hover:bg-red/20"
                        >
                          {t.deleteConfirm}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="btn btn-ghost text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="btn btn-ghost text-xs text-muted hover:text-red hover:border-red/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {t.delete}
                      </button>
                    )}
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
