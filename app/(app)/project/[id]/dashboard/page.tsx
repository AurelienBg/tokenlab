'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getLocalProject, saveLocalProject } from '@/lib/storage'
import { LocalProject, HealthScore, Project, ProjectType, ProjectStage } from '@/lib/types'
import { computeHealthScore } from '@/lib/healthScore'
import { MODULES } from '@/lib/constants'
import { useLang } from '@/components/LangProvider'
import { ExportButton } from '@/components/pdf/ExportButton'
import { encodeShareToken } from '@/lib/share'

export default function DashboardPage() {
  const params = useParams()
  const id = params.id as string
  const [lp, setLp] = useState<LocalProject | null>(null)
  const [health, setHealth] = useState<HealthScore | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Project>>({})
  const [copied, setCopied] = useState(false)
  const { t } = useLang()

  function handleShare() {
    const current = getLocalProject(id)
    if (!current) return
    const token = encodeShareToken(current)
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    const data = getLocalProject(id)
    if (data) {
      setLp(data)
      setHealth(computeHealthScore(data.modules))
    }
  }, [id])

  function startEdit() {
    if (!lp) return
    setEditForm({
      name: lp.project.name,
      description: lp.project.description,
      token_name: lp.project.token_name,
      token_ticker: lp.project.token_ticker,
      blockchain: lp.project.blockchain,
      project_type: lp.project.project_type ?? undefined,
      project_stage: lp.project.project_stage ?? undefined,
    })
    setEditing(true)
  }

  function handleEditSave() {
    if (!lp) return
    const updated: Project = {
      ...lp.project,
      name: editForm.name?.trim() || lp.project.name,
      description: editForm.description?.trim() ?? lp.project.description,
      token_name: editForm.token_name?.trim() ?? lp.project.token_name,
      token_ticker: editForm.token_ticker?.trim().toUpperCase() ?? lp.project.token_ticker,
      blockchain: editForm.blockchain?.trim() ?? lp.project.blockchain,
      project_type: (editForm.project_type || null) as ProjectType | null,
      project_stage: (editForm.project_stage || null) as ProjectStage | null,
      updated_at: new Date().toISOString(),
    }
    saveLocalProject(updated)
    setLp({ ...lp, project: updated })
    setEditing(false)
  }

  if (!lp) return null

  const { project } = lp
  const completedCount = MODULES.filter((m) =>
    project.completed_modules & (1 << MODULES.indexOf(m))
  ).length

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        {editing ? (
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-foreground">{t.editProject}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">{t.projectName}</label>
                <input className="input" value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div className="col-span-2">
                <label className="label">{t.description}</label>
                <textarea className="input" rows={2} value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="label">{t.tokenName}</label>
                <input className="input" value={editForm.token_name ?? ''} onChange={e => setEditForm(f => ({ ...f, token_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">{t.tokenTicker}</label>
                <input className="input" value={editForm.token_ticker ?? ''} onChange={e => setEditForm(f => ({ ...f, token_ticker: e.target.value }))} />
              </div>
              <div>
                <label className="label">{t.blockchain}</label>
                <input className="input" value={editForm.blockchain ?? ''} onChange={e => setEditForm(f => ({ ...f, blockchain: e.target.value }))} />
              </div>
              <div>
                <label className="label">{t.projectStage}</label>
                <select className="input" value={editForm.project_stage ?? ''} onChange={e => setEditForm(f => ({ ...f, project_stage: e.target.value as ProjectStage | undefined }))}>
                  <option value="">—</option>
                  <option value="ideation">Idéation</option>
                  <option value="mvp">MVP</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="btn btn-ghost text-sm">{t.cancel}</button>
              <button onClick={handleEditSave} className="btn btn-primary text-sm">{t.save}</button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <button onClick={startEdit} className="text-muted hover:text-foreground transition-colors" title={t.editProject}>
                  <EditIcon />
                </button>
              </div>
              <p className="text-sm text-muted mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.token_ticker && (
                  <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-1 rounded">
                    ${project.token_ticker}
                  </span>
                )}
                {project.blockchain && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded">
                    {project.blockchain}
                  </span>
                )}
                {project.project_type && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded">
                    {project.project_type.replace(/_/g, ' ')}
                  </span>
                )}
                {project.project_stage && (
                  <span className="text-xs bg-surface-2 text-muted px-2 py-1 rounded capitalize">
                    {project.project_stage}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className={`btn btn-ghost text-sm gap-1.5 ${copied ? 'text-green' : ''}`}
                title="Copier le lien de partage"
              >
                {copied ? (
                  <><CheckIcon /> Copié !</>
                ) : (
                  <><ShareIcon /> Partager</>
                )}
              </button>
              <ExportButton projectId={id} label={t.exportPDF ?? 'Export PDF'} />
              <Link href={`/project/${id}/coach`} className="btn btn-primary">
                ✦ {t.coachIA}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Score + progress */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card col-span-1 flex flex-col items-center justify-center py-6">
          <div className={`text-4xl font-bold mb-1 ${
            (health?.total ?? 0) >= 70 ? 'text-green' :
            (health?.total ?? 0) >= 40 ? 'text-yellow' : 'text-red'
          }`}>
            {health?.total ?? 0}
          </div>
          <div className="text-xs text-muted uppercase tracking-wider">{t.healthScore}</div>
          <div className="text-xs text-muted mt-1">/ 100</div>
        </div>

        <div className="card col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{t.globalProgress}</span>
            <span className="text-sm text-muted">{completedCount} / {MODULES.length} {t.modules}</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${Math.round((completedCount / MODULES.length) * 100)}%` }}
            />
          </div>
          {health && health.gaps.length > 0 && (
            <div className="mt-4 space-y-1">
              {health.gaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted">
                  <span className="text-yellow shrink-0 mt-0.5">⚠</span>
                  <span>{gap}</span>
                </div>
              ))}
              {health.gaps.length > 3 && (
                <p className="text-xs text-muted pl-4">
                  +{health.gaps.length - 3} {t.moreAlerts}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modules grid */}
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">{t.modulesSection}</h2>
      <div className="grid grid-cols-2 gap-3">
        {MODULES.map((mod) => {
          const data = lp.modules[mod.key]
          const isComplete = data?.is_complete ?? false
          const hasData = !!data
          const ml = t.modules_labels[mod.key]

          return (
            <Link
              key={mod.key}
              href={`/project/${id}/${mod.path}`}
              className="card hover:border-accent/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted">{ml.shortLabel}</span>
                    {isComplete ? (
                      <span className="text-[10px] bg-green/10 text-green px-1.5 py-0.5 rounded font-medium">{t.complete}</span>
                    ) : hasData ? (
                      <span className="text-[10px] bg-yellow/10 text-yellow px-1.5 py-0.5 rounded font-medium">{t.inProgress}</span>
                    ) : (
                      <span className="text-[10px] bg-surface-2 text-muted px-1.5 py-0.5 rounded">{t.empty}</span>
                    )}
                    {mod.optional && (
                      <span className="text-[10px] text-muted">{t.optional}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {ml.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5 truncate">{ml.description}</p>
                </div>
                <span className="text-muted group-hover:text-accent transition-colors text-sm shrink-0">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
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

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}
