'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { decodeShareToken } from '@/lib/share'
import { saveLocalProject, getLocalProject } from '@/lib/storage'
import { LocalProject, M4Data, M5Data, M6Data } from '@/lib/types'
import { MODULES } from '@/lib/constants'
import { computeHealthScore } from '@/lib/healthScore'
import { computeSupplySimulation, formatSupply } from '@/lib/supplySimulation'
import { useLang } from '@/components/LangProvider'

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLang()
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
        <h1 className="text-lg font-semibold text-foreground mb-1">{t.invalidLink}</h1>
        <p className="text-sm text-muted mb-4">{t.invalidLinkDesc}</p>
        <Link href="/projects" className="btn btn-primary">{t.myProjects}</Link>
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
          <span className="text-xs text-muted hidden sm:block">{t.sharedReadOnly}</span>
          <Link href="/projects/new" className="btn btn-primary text-xs">
            {t.createMyProject}
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
              {imported ? t.alreadyImported : t.importToTokenlab}
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
            <div className="text-xs text-muted uppercase tracking-wider">{t.healthScoreLabel}</div>
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
              {Math.round((completedCount / MODULES.length) * 100)}{t.modulesCompleted}
            </p>
          </div>
        </div>

        {/* Mini supply chart */}
        {(() => {
          const m4 = modules['m4']?.data as M4Data | undefined
          const m5 = modules['m5']?.data as M5Data | undefined
          const m6 = modules['m6']?.data as M6Data | undefined
          if (!m4?.total_supply || !m5?.allocations?.length) return null
          const { points, categories, totalSupply } = computeSupplySimulation(m4 ?? null, m5 ?? null, m6 ?? null, 48)
          if (points.length === 0) return null
          const W = 600; const H = 90
          const PL = 8; const PR = 8; const PT = 8; const PB = 8
          const cW = W - PL - PR; const cH = H - PT - PB
          const xPos = (m: number) => PL + (m / 48) * cW
          const yPos = (v: number) => PT + cH - (v / totalSupply) * cH
          const totalLine = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(p.month).toFixed(1)},${yPos(p.total).toFixed(1)}`).join(' ')
          const tgePct = Math.round((points[0].total / totalSupply) * 100)
          const m24Pct = Math.round(((points[24]?.total ?? 0) / totalSupply) * 100)
          const m48Pct = Math.round(((points[48]?.total ?? 0) / totalSupply) * 100)
          return (
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-foreground">{t.simulation}</h2>
                <span className="text-xs text-muted">{formatSupply(totalSupply)} tokens · 48 months</span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }}>
                {categories.map((cat, ci) => {
                  const getBase = (month: number) => { let b = 0; for (let i = 0; i < ci; i++) b += points[month].byCategory[categories[i].category] ?? 0; return b }
                  const top = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xPos(p.month).toFixed(1)},${yPos(getBase(p.month) + (p.byCategory[cat.category] ?? 0)).toFixed(1)}`).join(' ')
                  const bot = [...points].reverse().map((p) => `L${xPos(p.month).toFixed(1)},${yPos(getBase(p.month)).toFixed(1)}`).join(' ')
                  return <path key={cat.category} d={`${top} ${bot} Z`} fill={cat.color} fillOpacity={0.2} />
                })}
                <path d={totalLine} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} strokeOpacity={0.8} />
                {[0, 24, 48].map((m) => {
                  const pt = points[m]; if (!pt) return null
                  return <circle key={m} cx={xPos(m)} cy={yPos(pt.total)} r={2.5} fill="var(--color-accent)" />
                })}
              </svg>
              <div className="flex gap-4 mt-2">
                {[{ label: 'TGE', pct: tgePct }, { label: 'M24', pct: m24Pct }, { label: 'M48', pct: m48Pct }].map(({ label, pct }) => (
                  <div key={label} className="text-center">
                    <p className="text-[10px] text-muted">{label}</p>
                    <p className={`text-xs font-semibold ${pct >= 70 ? 'text-red' : pct >= 40 ? 'text-yellow' : 'text-green'}`}>{pct}%</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

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
          {t.structuredWith}{' '}
          <Link href="/" className="text-accent hover:underline">Tokenlab</Link>
        </p>
      </div>
    </div>
  )
}
