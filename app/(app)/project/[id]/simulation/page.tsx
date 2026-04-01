'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getLocalModuleData } from '@/lib/storage'
import { M4Data, M5Data, M6Data } from '@/lib/types'
import { computeSupplySimulation, formatSupply } from '@/lib/supplySimulation'
import SupplyChart from '@/components/SupplyChart'
import { useLang } from '@/components/LangProvider'

const HORIZONS = [24, 36, 48, 60]

export default function SimulationPage() {
  const { id } = useParams() as { id: string }
  const { t } = useLang()
  const [m4, setM4] = useState<M4Data | null>(null)
  const [m5, setM5] = useState<M5Data | null>(null)
  const [m6, setM6] = useState<M6Data | null>(null)
  const [horizon, setHorizon] = useState(48)

  useEffect(() => {
    const d4 = getLocalModuleData(id, 'm4')
    const d5 = getLocalModuleData(id, 'm5')
    const d6 = getLocalModuleData(id, 'm6')
    if (d4) setM4(d4.data as M4Data)
    if (d5) setM5(d5.data as M5Data)
    if (d6) setM6(d6.data as M6Data)
  }, [id])

  const { points, categories, totalSupply } = computeSupplySimulation(m4, m5, m6, horizon)

  const hasData = totalSupply > 0 && categories.length > 0

  // Helper to fill template strings like "{n}" or "{cat}"
  const fill = (tpl: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), tpl)

  // Warnings S5-5
  type Warning = { level: 'red' | 'yellow'; msg: string; fix: string }
  const warnings: Warning[] = []
  if (hasData) {
    const tgePt = points[0]
    const tgePct = tgePt ? Math.round((tgePt.total / totalSupply) * 100) : 0
    const m12pt = points[Math.min(12, points.length - 1)]
    const m12pct = m12pt ? Math.round((m12pt.total / totalSupply) * 100) : 0

    if (tgePct > 30)
      warnings.push({ level: 'red', msg: fill(t.simWarnTgeHigh, { n: tgePct }), fix: t.simFixTgeHigh })
    else if (tgePct > 20)
      warnings.push({ level: 'yellow', msg: fill(t.simWarnTgeMed, { n: tgePct }), fix: t.simFixTgeMed })

    if (m12pct > 70)
      warnings.push({ level: 'red', msg: fill(t.simWarnM12High, { n: m12pct }), fix: t.simFixM12High })
    else if (m12pct > 50)
      warnings.push({ level: 'yellow', msg: fill(t.simWarnM12Med, { n: m12pct }), fix: t.simFixM12Med })

    const cliffCounts: Record<number, number> = {}
    categories.map(c => c.cliff).filter(c => c > 0).forEach(c => { cliffCounts[c] = (cliffCounts[c] ?? 0) + 1 })
    Object.entries(cliffCounts).filter(([, count]) => count >= 2).forEach(([month]) => {
      warnings.push({ level: 'yellow', msg: fill(t.simWarnCliff, { n: month }), fix: t.simFixCliff })
    })

    categories.forEach(cat => {
      if (cat.vesting === 0 && cat.tokens / totalSupply > 0.1)
        warnings.push({ level: 'red', msg: fill(t.simWarnNoVesting, { cat: cat.category, n: Math.round(cat.tokens/totalSupply*100) }), fix: t.simFixNoVesting })
    })
  }

  // Circulating at key months
  const keyMonths = [0, 6, 12, 24, 36, 48].filter((m) => m <= horizon)
  const keyData = keyMonths.map((m) => {
    const pt = points[m]
    return {
      month: m,
      total: pt?.total ?? 0,
      pct: totalSupply > 0 ? Math.round(((pt?.total ?? 0) / totalSupply) * 100) : 0,
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t.simTitle}</h1>
        <p className="text-sm text-muted mt-1">{t.simSubtitle}</p>
      </div>

      {!hasData ? (
        <div className="card text-center py-12">
          <p className="text-3xl mb-3">∿</p>
          <h2 className="text-base font-semibold text-foreground mb-2">{t.simNoData}</h2>
          <p className="text-sm text-muted mb-5 max-w-sm mx-auto">{t.simNoDataDesc}</p>
          <div className="flex justify-center gap-3">
            <Link href={`/project/${id}/module/4`} className="btn btn-ghost text-sm">→ Module 4</Link>
            <Link href={`/project/${id}/module/5`} className="btn btn-ghost text-sm">→ Module 5</Link>
            <Link href={`/project/${id}/module/6`} className="btn btn-primary text-sm">→ Module 6</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Horizon selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{t.simHorizon}</span>
            {HORIZONS.map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  horizon === h
                    ? 'bg-accent text-white border-accent'
                    : 'border-border text-muted hover:text-foreground hover:border-accent/50'
                }`}
              >
                {h}m
              </button>
            ))}
            <span className="text-xs text-muted ml-2">
              {t.simTotalSupply} <strong className="text-foreground">{formatSupply(totalSupply)}</strong>
            </span>
          </div>

          {/* Alerts S5-5 */}
          {warnings.length === 0 ? (
            <div className="card bg-green/5 border-green/20">
              <p className="text-xs text-green font-medium">{t.simNoAlerts}</p>
            </div>
          ) : (
            <div className={`card border ${warnings.some(w => w.level === 'red') ? 'bg-red/5 border-red/20' : 'bg-yellow/5 border-yellow/20'}`}>
              <div className="space-y-3">
                {warnings.map((w, i) => (
                  <div key={i} className={`flex items-start gap-2 ${i > 0 ? 'pt-3 border-t border-border/50' : ''}`}>
                    <span className={`shrink-0 text-sm ${w.level === 'red' ? 'text-red' : 'text-yellow'}`}>
                      {w.level === 'red' ? '⛔' : '⚠'}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${w.level === 'red' ? 'text-red' : 'text-yellow'}`}>{w.msg}</p>
                      <p className="text-xs text-muted mt-0.5">→ {w.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">{t.simChartTitle}</h2>
              {!m6 || (m6.vesting_schedules.length === 0) ? (
                <span className="text-[10px] text-yellow bg-yellow/10 px-2 py-0.5 rounded">
                  {t.simM6Missing}
                </span>
              ) : null}
            </div>
            <SupplyChart
              points={points}
              categories={categories}
              totalSupply={totalSupply}
              height={300}
            />
          </div>

          {/* Key months table */}
          <div className="card">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.simKeyMonths}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {keyData.map(({ month, total, pct }) => (
                <div key={month} className="text-center p-3 rounded-lg bg-surface-2">
                  <p className="text-[10px] text-muted mb-1">M{month}</p>
                  <p className={`text-lg font-bold ${
                    pct >= 80 ? 'text-red' : pct >= 50 ? 'text-yellow' : 'text-green'
                  }`}>{pct}%</p>
                  <p className="text-[10px] text-muted mt-0.5">{formatSupply(total)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Per-category breakdown */}
          <div className="card">
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.simBreakdown}</h2>
            <div className="space-y-2">
              {categories.map((cat) => {
                const tgeTokens = cat.tokens * (cat.tge_pct / 100)
                const tgePct = Math.round((tgeTokens / totalSupply) * 100)
                const fullyAt = cat.cliff + cat.vesting
                return (
                  <div key={cat.category} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cat.category}</p>
                      <p className="text-xs text-muted">
                        {formatSupply(cat.tokens)} {t.simTokens}
                        {cat.cliff > 0 && ` · ${t.simCliff} ${cat.cliff}m`}
                        {cat.vesting > 0 && ` · ${t.simVesting} ${cat.vesting}m`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground">{tgePct}% {t.simAtTge}</p>
                      {fullyAt > 0 ? (
                        <p className="text-[10px] text-muted">{fill(t.simFullAtMonth, { n: fullyAt })}</p>
                      ) : (
                        <p className="text-[10px] text-muted">{t.simFullAtTge}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
