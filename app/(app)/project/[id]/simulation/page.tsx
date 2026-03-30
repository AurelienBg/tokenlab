'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getLocalModuleData } from '@/lib/storage'
import { M4Data, M5Data, M6Data } from '@/lib/types'
import { computeSupplySimulation, formatSupply } from '@/lib/supplySimulation'
import SupplyChart from '@/components/SupplyChart'

const HORIZONS = [24, 36, 48, 60]

export default function SimulationPage() {
  const { id } = useParams() as { id: string }
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

  // Key milestones: months where a new category starts unlocking
  const milestones = categories
    .map((cat) => ({ category: cat.category, month: cat.cliff, fullyAt: cat.cliff + cat.vesting, color: cat.color }))
    .filter((m) => m.month > 0 || m.fullyAt > 0)
    .sort((a, b) => a.month - b.month)

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
        <h1 className="text-2xl font-bold text-foreground">Supply Simulation</h1>
        <p className="text-sm text-muted mt-1">Circulating supply dans le temps — M4 + M5 + M6</p>
      </div>

      {!hasData ? (
        <div className="card text-center py-12">
          <p className="text-3xl mb-3">∿</p>
          <h2 className="text-base font-semibold text-foreground mb-2">Données insuffisantes</h2>
          <p className="text-sm text-muted mb-5 max-w-sm mx-auto">
            Remplissez au minimum <strong>M4</strong> (supply totale) et <strong>M5</strong> (allocations) pour générer la simulation.
          </p>
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
            <span className="text-xs text-muted">Horizon :</span>
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
              Supply totale : <strong className="text-foreground">{formatSupply(totalSupply)}</strong>
            </span>
          </div>

          {/* Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Circulating Supply (%)</h2>
              {!m6 || (m6.vesting_schedules.length === 0) ? (
                <span className="text-[10px] text-yellow bg-yellow/10 px-2 py-0.5 rounded">
                  ⚠ M6 manquant — vesting supposé 100% au TGE
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
            <h2 className="text-sm font-semibold text-foreground mb-3">Supply circulante aux jalons clés</h2>
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
            <h2 className="text-sm font-semibold text-foreground mb-3">Détail par catégorie</h2>
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
                        {formatSupply(cat.tokens)} tokens
                        {cat.cliff > 0 && ` · cliff ${cat.cliff}m`}
                        {cat.vesting > 0 && ` · vesting ${cat.vesting}m`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground">{tgePct}% au TGE</p>
                      {fullyAt > 0 ? (
                        <p className="text-[10px] text-muted">100% à M{fullyAt}</p>
                      ) : (
                        <p className="text-[10px] text-muted">100% au TGE</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Warnings */}
          {(() => {
            const m12pt = points[Math.min(12, points.length - 1)]
            const m12pct = m12pt ? Math.round((m12pt.total / totalSupply) * 100) : 0
            const tgePt = points[0]
            const tgePct = tgePt ? Math.round((tgePt.total / totalSupply) * 100) : 0
            const warnings: string[] = []
            if (tgePct > 20) warnings.push(`⚠ ${tgePct}% de la supply circulante au TGE — risque de sell pressure élevé`)
            if (m12pct > 60) warnings.push(`⚠ ${m12pct}% en circulation à M12 — vérifiez la rétention des holders`)
            if (warnings.length === 0) return null
            return (
              <div className="card bg-yellow/5 border-yellow/20">
                <h2 className="text-xs font-semibold text-yellow mb-2 uppercase tracking-wider">Alertes</h2>
                <ul className="space-y-1">
                  {warnings.map((w, i) => (
                    <li key={i} className="text-xs text-muted">{w}</li>
                  ))}
                </ul>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
