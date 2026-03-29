'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M6Data, VestingSchedule } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'

const DEFAULT: M6Data = { vesting_schedules: [], sell_pressure_notes: '', notes: '' }

const VESTING_TYPES = [
  { value: 'linear', label: 'Linear/Time-based', description: 'Moins de volatilité, flux prévisible' },
  { value: 'event_driven', label: 'Event-driven', description: 'Déclenché par milestone ou KPI' },
  { value: 'specific_date', label: 'Specific date', description: 'Blocs à dates fixes, plus de volatilité' },
] as const

export default function Module6Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M6Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm6')
    if (mod) setData(mod.data as M6Data)
  }, [id])

  function addSchedule() {
    setData((p) => ({
      ...p,
      vesting_schedules: [...p.vesting_schedules, {
        id: generateId(),
        category: 'Team & Advisors',
        cliff_months: 6,
        vesting_months: 24,
        tge_unlock_pct: 0,
        vesting_type: 'linear',
      }],
    }))
    setSaved(false)
  }

  function updateSchedule(sid: string, patch: Partial<VestingSchedule>) {
    setData((p) => ({ ...p, vesting_schedules: p.vesting_schedules.map((s) => s.id === sid ? { ...s, ...patch } : s) }))
    setSaved(false)
  }

  function removeSchedule(sid: string) {
    setData((p) => ({ ...p, vesting_schedules: p.vesting_schedules.filter((s) => s.id !== sid) }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm6',
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
      title="Vesting & Sell Pressure"
      subtitle="Module 6 — Calendrier de déblocage et analyse de la pression vendeuse"
      projectId={id}
      moduleKey="m6"
      saved={saved}
      onSave={handleSave}
    >
      {/* Vesting schedules */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Calendriers de vesting</h3>
          <button onClick={addSchedule} className="btn btn-ghost text-xs">+ Ajouter</button>
        </div>

        {data.vesting_schedules.length === 0 && (
          <p className="text-xs text-muted">Ajoutez un calendrier par catégorie d'allocation.</p>
        )}

        <div className="space-y-4">
          {data.vesting_schedules.map((s) => (
            <div key={s.id} className="p-4 rounded-lg border border-border bg-surface-2 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  value={s.category}
                  onChange={(e) => updateSchedule(s.id, { category: e.target.value })}
                  placeholder="Catégorie (ex: Team, Investors)"
                  className="input flex-1"
                />
                <button onClick={() => removeSchedule(s.id)} className="text-muted hover:text-red transition-colors px-2">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Cliff (mois)</label>
                  <input
                    type="number"
                    min="0"
                    value={s.cliff_months}
                    onChange={(e) => updateSchedule(s.id, { cliff_months: Number(e.target.value) })}
                    className="input"
                  />
                  {s.cliff_months < 6 && s.category.toLowerCase().includes('team') && (
                    <p className="text-[10px] text-yellow mt-0.5">⚠ Recommandé : ≥ 6 mois</p>
                  )}
                </div>
                <div>
                  <label className="label">Vesting (mois)</label>
                  <input
                    type="number"
                    min="0"
                    value={s.vesting_months}
                    onChange={(e) => updateSchedule(s.id, { vesting_months: Number(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">TGE unlock (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={s.tge_unlock_pct}
                    onChange={(e) => updateSchedule(s.id, { tge_unlock_pct: Number(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Type de vesting</label>
                <div className="flex gap-2">
                  {VESTING_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => updateSchedule(s.id, { vesting_type: t.value })}
                      title={t.description}
                      className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${
                        s.vesting_type === t.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-muted hover:bg-surface-hover'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="text-xs text-muted bg-surface px-3 py-2 rounded">
                {s.tge_unlock_pct}% au TGE → cliff {s.cliff_months}m → {s.vesting_months}m de vesting {s.vesting_type === 'linear' ? 'linéaire' : s.vesting_type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sell pressure */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-2">Analyse de sell pressure</h3>
        <div className="text-xs text-muted bg-surface-2 px-3 py-2 rounded mb-3 font-mono">
          Sell Pressure = (Unlocked Supply + Realized Rewards) – Treasury Recapture via buybacks
        </div>
        <label className="label">Notes sur la pression vendeuse</label>
        <textarea
          value={data.sell_pressure_notes}
          onChange={(e) => { setData((p) => ({ ...p, sell_pressure_notes: e.target.value })); setSaved(false) }}
          rows={3}
          className="input"
          placeholder="Pics de sell pressure identifiés ? Mécanismes de rétention prévus (ve-locking, staking, reinvestment) ?"
        />
      </div>

      {/* Best practices */}
      <div className="card bg-surface-2">
        <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Bonnes pratiques (Pantera Capital)</h3>
        <ul className="text-xs text-muted space-y-1.5">
          <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Linear vesting &gt; specific date pour la stabilité du prix</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Larger initial unlocks → less negative price impact</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">→</span>6-month cliff préférable à 1-year ou no cliff</li>
          <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Ratio L/S sain : 3–8% de la circulating supply en liquidité DEX</li>
        </ul>
      </div>

      <div className="card">
        <label className="label">Notes générales</label>
        <textarea
          value={data.notes}
          onChange={(e) => { setData((p) => ({ ...p, notes: e.target.value })); setSaved(false) }}
          rows={3}
          className="input"
        />
      </div>
    </ModuleShell>
  )
}
