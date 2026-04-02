'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M5Data, Allocation } from '@/lib/types'
import { ALLOCATION_BENCHMARKS } from '@/lib/constants'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'
import { useLang } from '@/components/LangProvider'
import SupplyTabs from '@/components/SupplyTabs'

const DEFAULT_ALLOCATIONS: Allocation[] = [
  { id: '1', category: 'Team & Advisors', percentage: 15, rationale: '' },
  { id: '2', category: 'Investors', percentage: 20, rationale: '' },
  { id: '3', category: 'Community & Ecosystem', percentage: 40, rationale: '' },
  { id: '4', category: 'Treasury & Reserves', percentage: 15, rationale: '' },
  { id: '5', category: 'Liquidity', percentage: 10, rationale: '' },
]

const DEFAULT: M5Data = { allocations: DEFAULT_ALLOCATIONS, notes: '' }

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function Module5Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M5Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm5')
    if (mod) setData(mod.data as M5Data)
  }, [id])

  const total = data.allocations.reduce((s, a) => s + (a.percentage || 0), 0)
  const isBalanced = Math.abs(total - 100) < 0.5

  function updateAllocation(aId: string, patch: Partial<Allocation>) {
    setData((p) => ({ ...p, allocations: p.allocations.map((a) => a.id === aId ? { ...a, ...patch } : a) }))
    setSaved(false)
  }

  function addAllocation() {
    setData((p) => ({ ...p, allocations: [...p.allocations, { id: generateId(), category: t.m5_newCategory, percentage: 0, rationale: '' }] }))
    setSaved(false)
  }

  function removeAllocation(aId: string) {
    setData((p) => ({ ...p, allocations: p.allocations.filter((a) => a.id !== aId) }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm5',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  useAutoSave(data, handleSave)

  return (
    <ModuleShell
      title="Distribution & Allocation"
      subtitle={t.m5_subtitle}
      projectId={id}
      moduleKey="m5"
      saved={saved}
      onSave={handleSave}
      overrideNext={{ href: `/project/${id}/simulation`, label: 'Simulation' }}
    >
      <SupplyTabs projectId={id} />
      {/* Donut visualization */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{t.m5_allocationTitle}</h3>
          <span className={`text-sm font-bold ${isBalanced ? 'text-green' : 'text-red'}`}>
            {t.m5_totalLabel} {total.toFixed(1)}%
            {!isBalanced && ' ≠ 100%'}
          </span>
        </div>

        {/* Bar visualization */}
        <div className="h-8 rounded-lg overflow-hidden flex mb-4">
          {data.allocations.map((a, i) => (
            <div
              key={a.id}
              style={{
                width: `${(a.percentage / Math.max(total, 100)) * 100}%`,
                backgroundColor: COLORS[i % COLORS.length],
              }}
              title={`${a.category}: ${a.percentage}%`}
              className="transition-all"
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {data.allocations.map((a, i) => (
            <div key={a.id} className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-muted">{a.category}</span>
              <span className="font-medium text-foreground">{a.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allocations table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{t.m5_allocationDetailTitle}</h3>
          <button onClick={addAllocation} className="btn btn-ghost text-xs">{t.m5_addBtn}</button>
        </div>

        {/* Mobile: stacked cards; Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted border-b border-border">
                <th className="text-left pb-2 font-medium">{t.m5_colCategory}</th>
                <th className="text-right pb-2 font-medium w-24">%</th>
                <th className="text-left pb-2 font-medium pl-4">{t.m5_colRef}</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.allocations.map((a) => {
                const bench = ALLOCATION_BENCHMARKS.find((b) => b.category.toLowerCase() === a.category.toLowerCase())
                const outOfRange = bench && (a.percentage < bench.min || a.percentage > bench.max)
                return (
                  <tr key={a.id} className="group">
                    <td className="py-2 pr-2">
                      <input value={a.category} onChange={(e) => updateAllocation(a.id, { category: e.target.value })} className="bg-transparent text-foreground focus:outline-none w-full" />
                    </td>
                    <td className="py-2 text-right">
                      <input type="number" min="0" max="100" step="0.5" value={a.percentage}
                        onChange={(e) => updateAllocation(a.id, { percentage: Number(e.target.value) })}
                        className={`bg-transparent text-right focus:outline-none w-20 font-mono font-medium ${outOfRange ? 'text-yellow' : 'text-foreground'}`}
                      />
                    </td>
                    <td className="py-2 pl-4 text-xs text-muted">
                      {bench ? `${bench.min}–${bench.max}%` : '—'}
                      {outOfRange && <span className="text-yellow ml-1">⚠</span>}
                    </td>
                    <td className="py-2">
                      <button onClick={() => removeAllocation(a.id)} className="text-muted hover:text-red transition-colors opacity-0 group-hover:opacity-100">✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {data.allocations.map((a) => {
            const bench = ALLOCATION_BENCHMARKS.find((b) => b.category.toLowerCase() === a.category.toLowerCase())
            const outOfRange = bench && (a.percentage < bench.min || a.percentage > bench.max)
            return (
              <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg border border-border">
                <input value={a.category} onChange={(e) => updateAllocation(a.id, { category: e.target.value })}
                  className="bg-transparent text-foreground focus:outline-none flex-1 text-sm min-w-0" />
                <input type="number" min="0" max="100" step="0.5" value={a.percentage}
                  onChange={(e) => updateAllocation(a.id, { percentage: Number(e.target.value) })}
                  className={`w-16 text-right input py-1 text-sm font-mono ${outOfRange ? 'text-yellow' : ''}`}
                />
                <span className="text-xs text-muted shrink-0">%</span>
                <button onClick={() => removeAllocation(a.id)} className="text-muted hover:text-red transition-colors shrink-0">✕</button>
              </div>
            )
          })}
        </div>

        {!isBalanced && (
          <div className="mt-3 p-2 rounded bg-red/5 border border-red/20 text-xs text-red">
            {t.m5_warnTotal} {total.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Benchmarks reference */}
      <div className="card bg-surface-2">
        <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">{t.m5_benchmarksTitle}</h3>
        <div className="space-y-1">
          {ALLOCATION_BENCHMARKS.map((b) => (
            <div key={b.category} className="flex items-center justify-between text-xs">
              <span className="text-muted">{b.category}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-foreground">{b.min}–{b.max}%</span>
                <span className="text-muted">{b.vestingStandard}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="label">{t.m5_notesLabel}</label>
        <textarea
          value={data.notes}
          onChange={(e) => { setData((p) => ({ ...p, notes: e.target.value })); setSaved(false) }}
          rows={3}
          className="input"
          placeholder={t.m5_notesPlaceholder}
        />
      </div>
    </ModuleShell>
  )
}
