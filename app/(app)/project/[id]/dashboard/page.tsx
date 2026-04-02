'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getLocalProject, saveLocalProject, deleteLocalProject } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import { LocalProject, HealthScore, Project, ProjectType, ProjectStage } from '@/lib/types'
import { computeHealthScore } from '@/lib/healthScore'
import { MODULES } from '@/lib/constants'
import { useLang } from '@/components/LangProvider'
import { ExportButton } from '@/components/pdf/ExportButton'
import { encodeShareToken } from '@/lib/share'
import { computeSupplySimulation, formatSupply } from '@/lib/supplySimulation'
import { M4Data, M5Data, M6Data } from '@/lib/types'

export default function DashboardPage() {
  const params = useParams()
  const id = params.id as string
  const [lp, setLp] = useState<LocalProject | null>(null)
  const [health, setHealth] = useState<HealthScore | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Project>>({})
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { t, lang } = useLang()
  const router = useRouter()

  function handleDelete() {
    deleteLocalProject(id)
    router.push('/projects')
  }

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
    function load() {
      const data = getLocalProject(id)
      if (data) {
        setLp(data)
        setHealth(computeHealthScore(data.modules, lang))
      }
    }
    load()
    window.addEventListener('tokenlab:module-saved', load)
    return () => window.removeEventListener('tokenlab:module-saved', load)
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
      problem: lp.project.problem ?? '',
      why_blockchain: lp.project.why_blockchain ?? '',
      value_proposition: lp.project.value_proposition ?? '',
      key_metrics: lp.project.key_metrics ?? '',
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
      problem: editForm.problem?.trim() || undefined,
      why_blockchain: editForm.why_blockchain?.trim() || undefined,
      value_proposition: editForm.value_proposition?.trim() || undefined,
      key_metrics: editForm.key_metrics?.trim() || undefined,
      updated_at: new Date().toISOString(),
    }
    saveLocalProject(updated)
    setLp({ ...lp, project: updated })
    setEditing(false)
  }

  if (!lp) return null

  const { project } = lp
  const visibleModules = MODULES.filter(m => !m.hidden)

  const completedCount = visibleModules.filter((m) =>
    project.completed_modules & (1 << MODULES.indexOf(m))
  ).length

  const moduleStatuses = visibleModules.map((m) => {
    const bit = project.completed_modules & (1 << MODULES.indexOf(m))
    const mod = lp.modules[m.key]
    return bit ? 'complete' : mod ? 'partial' : 'empty'
  })

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
                  <option value="ideation">{t.stageIdeation}</option>
                  <option value="mvp">MVP</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>
            {/* Business context */}
            <div className="col-span-2 pt-2 border-t border-border">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">{t.npContextSection}</p>
            </div>
            <div className="col-span-2">
              <label className="label">{t.npProblem}</label>
              <textarea className="input" rows={2} value={editForm.problem ?? ''} onChange={e => setEditForm(f => ({ ...f, problem: e.target.value }))} placeholder={t.npProblemPlaceholder} />
            </div>
            <div className="col-span-2">
              <label className="label">{t.npWhyBlockchain}</label>
              <textarea className="input" rows={2} value={editForm.why_blockchain ?? ''} onChange={e => setEditForm(f => ({ ...f, why_blockchain: e.target.value }))} placeholder={t.npWhyBlockchainPlaceholder} />
            </div>
            <div className="col-span-2">
              <label className="label">{t.npValueProp}</label>
              <textarea className="input" rows={2} value={editForm.value_proposition ?? ''} onChange={e => setEditForm(f => ({ ...f, value_proposition: e.target.value }))} placeholder={t.npValuePropPlaceholder} />
            </div>
            <div className="col-span-2">
              <label className="label">{t.npKeyMetrics}</label>
              <input className="input" value={editForm.key_metrics ?? ''} onChange={e => setEditForm(f => ({ ...f, key_metrics: e.target.value }))} placeholder={t.npKeyMetricsPlaceholder} />
            </div>
            <div className="col-span-2 flex gap-2 justify-end">
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
              {confirmDelete ? (
                <>
                  <span className="text-xs text-muted">{t.deleteConfirm}</span>
                  <button onClick={handleDelete} className="btn text-xs bg-red/10 text-red border border-red/30 hover:bg-red/20">
                    {t.delete}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost text-xs">
                    {t.cancel}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-2 rounded-lg text-muted hover:text-red hover:bg-red/10 transition-colors"
                    title={t.delete}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    onClick={handleShare}
                    className={`btn btn-ghost text-sm gap-1.5 ${copied ? 'text-green' : ''}`}
                  >
                    {copied ? (
                      <><CheckIcon /> {t.copyLink}</>
                    ) : (
                      <><ShareIcon /> {t.share}</>
                    )}
                  </button>
                  <ExportButton projectId={id} label={t.exportPDF ?? 'Export PDF'} />
                  <Link href={`/project/${id}/coach`} className="btn btn-primary">
                    ✦ {t.coachIA}
                  </Link>
                </>
              )}
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
            {health?.total ?? 0}%
          </div>
          <div className="text-xs text-muted uppercase tracking-wider">{t.healthScore}</div>
        </div>

        <div className="card col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">{t.globalProgress}</span>
            <span className="text-sm text-muted">{completedCount} / {visibleModules.length} {t.modules}</span>
          </div>
          <div className="flex gap-1">
            {moduleStatuses.map((status, i) => (
              <div
                key={i}
                title={visibleModules[i].shortLabel}
                className={`flex-1 h-2 rounded-sm transition-all ${
                  status === 'complete' ? 'bg-accent' :
                  status === 'partial' ? 'bg-accent/35' :
                  'bg-surface-2'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {moduleStatuses.map((status, i) => (
              <div key={i} className="flex-1 text-center">
                <span className={`text-[8px] font-mono ${
                  status === 'complete' ? 'text-accent' : 'text-muted opacity-40'
                }`}>
                  {i + 1}
                </span>
              </div>
            ))}
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

      {/* Mini supply chart */}
      {(() => {
        const m4 = lp.modules['m4']?.data as M4Data | undefined
        const m5 = lp.modules['m5']?.data as M5Data | undefined
        const m6 = lp.modules['m6']?.data as M6Data | undefined
        if (!m4?.total_supply || !m5?.allocations?.length) return null
        const { points, categories, totalSupply } = computeSupplySimulation(m4 ?? null, m5 ?? null, m6 ?? null, 48)
        if (points.length === 0) return null
        const W = 600; const H = 80
        const PAD = { l: 8, r: 8, t: 8, b: 8 }
        const cW = W - PAD.l - PAD.r; const cH = H - PAD.t - PAD.b
        const xPos = (m: number) => PAD.l + (m / 48) * cW
        const yPos = (v: number) => PAD.t + cH - (v / totalSupply) * cH
        const totalLine = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(p.month).toFixed(1)},${yPos(p.total).toFixed(1)}`).join(' ')
        const tgePct = Math.round((points[0].total / totalSupply) * 100)
        const m24Pct = Math.round(((points[24]?.total ?? 0) / totalSupply) * 100)
        const m48Pct = Math.round(((points[48]?.total ?? 0) / totalSupply) * 100)
        return (
          <div className="card mb-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t.simulation}</h2>
                <p className="text-xs text-muted">{formatSupply(totalSupply)} tokens · 48 months</p>
              </div>
              <Link href={`/project/${id}/simulation`} className="text-xs text-accent hover:underline shrink-0">
                {t.simulation} →
              </Link>
            </div>
            {/* Chart */}
            <div className="rounded-lg overflow-hidden bg-surface-2 px-2 pt-2 pb-1">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
                {categories.map((cat, ci) => {
                  const getBase = (month: number) => {
                    let base = 0
                    for (let i = 0; i < ci; i++) base += points[month].byCategory[categories[i].category] ?? 0
                    return base
                  }
                  const topPts = points.map((p) => ({ x: xPos(p.month), y: yPos(getBase(p.month) + (p.byCategory[cat.category] ?? 0)) }))
                  const botPts = points.map((p) => ({ x: xPos(p.month), y: yPos(getBase(p.month)) }))
                  const top = topPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
                  const bot = [...botPts].reverse().map((pt) => `L${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
                  return <path key={cat.category} d={`${top} ${bot} Z`} fill={cat.color} fillOpacity={0.25} />
                })}
                <path d={totalLine} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} strokeOpacity={0.9} />
                {[0, 24, 48].map((m) => {
                  const pt = points[m]
                  if (!pt) return null
                  return <circle key={m} cx={xPos(m)} cy={yPos(pt.total)} r={2.5} fill="var(--color-accent)" />
                })}
              </svg>
              {/* Stats row inside the chart area */}
              <div className="flex gap-6 px-1 pb-1 mt-1">
                {[{ label: 'TGE', pct: tgePct }, { label: 'M24', pct: m24Pct }, { label: 'M48', pct: m48Pct }].map(({ label, pct }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted">{label}</span>
                    <span className={`text-xs font-bold ${pct >= 70 ? 'text-red' : pct >= 40 ? 'text-yellow' : 'text-green'}`}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modules grid */}
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">{t.modulesSection}</h2>
      <div className="grid grid-cols-2 gap-3">
        {visibleModules.map((mod) => {
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

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
