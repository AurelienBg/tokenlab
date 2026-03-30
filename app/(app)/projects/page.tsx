'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getLocalProjects, deleteLocalProject, getLocalProject, duplicateLocalProject } from '@/lib/storage'
import { Project } from '@/lib/types'
import { MODULES } from '@/lib/constants'
import { useLang } from '@/components/LangProvider'
import { encodeShareToken } from '@/lib/share'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [duplicatedId, setDuplicatedId] = useState<string | null>(null)
  const { t, lang } = useLang()
  const router = useRouter()

  function handleDuplicate(id: string) {
    const newId = duplicateLocalProject(id)
    if (!newId) return
    setProjects(getLocalProjects())
    setDuplicatedId(newId)
    setTimeout(() => setDuplicatedId(null), 2000)
  }

  function handleShare(id: string) {
    const lp = getLocalProject(id)
    if (!lp) return
    const token = encodeShareToken(lp)
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

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
    <div className="max-w-5xl mx-auto px-6 py-10">
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
          <div className="text-4xl mb-4">⬡</div>
          <h2 className="text-lg font-semibold text-foreground mb-2">{t.noProjectsYet}</h2>
          <p className="text-sm text-muted mb-6 max-w-xs mx-auto">{t.noProjectsDesc}</p>
          <Link href="/projects/new" className="btn btn-primary">
            {t.createProject}
          </Link>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const completed = completedCount(p)
            const total = MODULES.length
            const pct = Math.round((completed / total) * 100)
            const initial = p.name.charAt(0).toUpperCase()

            return (
              <li key={p.id} className="relative group">
                <Link
                  href={`/project/${p.id}/dashboard`}
                  className="block p-4 rounded-xl border border-border bg-surface hover:border-accent/50 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {p.project_type && (
                          <span className="text-[10px] text-muted bg-surface-2 px-1.5 py-0.5 rounded">
                            {projectTypeLabel(p.project_type)}
                          </span>
                        )}
                        {p.project_stage && (
                          <span className="text-[10px] text-muted bg-surface-2 px-1.5 py-0.5 rounded capitalize">
                            {p.project_stage}
                          </span>
                        )}
                        {p.blockchain && (
                          <span className="text-[10px] text-muted bg-surface-2 px-1.5 py-0.5 rounded">
                            {p.blockchain}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {p.description && (
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                  )}

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-muted mb-1.5">
                      <span>{t.progressLabel}</span>
                      <span>{completed}/{total}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {MODULES.map((m, i) => {
                        const done = !!(p.completed_modules & (1 << i))
                        return (
                          <div
                            key={m.key}
                            className={`flex-1 h-1.5 rounded-sm transition-all ${done ? 'bg-accent' : 'bg-surface-2'}`}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted">
                      {new Date(p.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                    {p.health_score > 0 && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        p.health_score >= 70 ? 'bg-green/10 text-green' :
                        p.health_score >= 40 ? 'bg-yellow/10 text-yellow' : 'bg-red/10 text-red'
                      }`}>
                        {p.health_score}/100
                      </span>
                    )}
                  </div>
                </Link>

                {/* Actions hover */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); router.push(`/project/${p.id}/dashboard`) }}
                    className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:border-accent/50 transition-colors"
                    title={t.editProject}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDuplicate(p.id) }}
                    className={`p-1.5 rounded-lg bg-surface border transition-colors ${
                      duplicatedId && projects.find(x => x.id === duplicatedId)?.name.startsWith(p.name)
                        ? 'border-accent/30 text-accent'
                        : 'border-border text-muted hover:text-foreground hover:border-accent/50'
                    }`}
                    title={t.duplicate}
                  >
                    <DuplicateIcon />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleShare(p.id) }}
                    className={`p-1.5 rounded-lg bg-surface border transition-colors ${
                      copiedId === p.id
                        ? 'border-green/30 text-green'
                        : 'border-border text-muted hover:text-foreground hover:border-accent/50'
                    }`}
                    title={t.copyLink}
                  >
                    {copiedId === p.id ? <CheckIcon /> : <ShareIcon />}
                  </button>
                  {confirmDelete === p.id ? (
                    <>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDelete(p.id) }}
                        className="p-1.5 rounded-lg bg-red/10 border border-red/30 text-red transition-colors text-[10px] font-medium px-2"
                      >
                        {t.deleteConfirm}
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setConfirmDelete(null) }}
                        className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-foreground transition-colors"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => { e.preventDefault(); setConfirmDelete(p.id) }}
                      className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-red hover:border-red/30 transition-colors"
                      title={t.delete}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function projectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    web3_native: 'Web3', web2_to_web3: 'Web2→Web3',
    dao: 'DAO', rwa: 'RWA', social_impact: 'Social',
  }
  return labels[type] || type
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 7l6-3M5 9l6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DuplicateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 11V3a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
