'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M4Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'

const DEFAULT: M4Data = {
  total_supply: null,
  supply_type: null,
  emission_model: null,
  emission_phases: [],
  max_inflation_rate: null,
  notes: '',
}

const SUPPLY_TYPES = [
  { value: 'fixed', label: 'Fixed Supply', examples: 'BTC, ADA', description: 'Max prédéfini, scarcité digitale' },
  { value: 'inflationary', label: 'Inflationary', examples: 'ETH PoW, MATIC', description: 'Émission continue' },
  { value: 'deflationary', label: 'Deflationary', examples: 'XRP, BNB', description: 'Burn progressif' },
  { value: 'elastic', label: 'Dynamic/Elastic', examples: 'ETH 2.0 PoS', description: 'Ajustement selon conditions réseau' },
] as const

const EMISSION_MODELS = [
  { value: 'fixed', label: 'Fixed', description: 'Émission fixe par période' },
  { value: 'decaying', label: 'Decaying', description: 'Réduction progressive (ex: halving)' },
  { value: 'event_based', label: 'Event-based', description: 'Déclenchée par des milestones' },
  { value: 'adaptive', label: 'Adaptive', description: 'Trigger-based, adapté à l\'activité' },
] as const

export default function Module4Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M4Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm4')
    if (mod) setData(mod.data as M4Data)
  }, [id])

  function update(patch: Partial<M4Data>) {
    setData((p) => ({ ...p, ...patch }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm4',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  useAutoSave(data, handleSave)

  function formatNumber(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
  }

  return (
    <ModuleShell
      title="Supply-Side & Emission Design"
      subtitle="Module 4 — Définissez la supply totale et le modèle d'émission"
      projectId={id}
      moduleKey="m4"
      saved={saved}
      onSave={handleSave}
    >
      {/* Supply basics */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Supply</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Total Supply</label>
            <input
              type="number"
              min="0"
              value={data.total_supply ?? ''}
              onChange={(e) => update({ total_supply: e.target.value ? Number(e.target.value) : null })}
              placeholder="ex: 1000000000"
              className="input"
            />
            {data.total_supply && (
              <p className="text-xs text-muted mt-1">{formatNumber(data.total_supply)} tokens</p>
            )}
          </div>
          <div>
            <label className="label">Taux d'inflation max (% / an)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.max_inflation_rate ?? ''}
              onChange={(e) => update({ max_inflation_rate: e.target.value ? Number(e.target.value) : null })}
              placeholder="ex: 5 (si inflationary)"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Supply type */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Modèle de supply</h3>
        <div className="grid grid-cols-2 gap-2">
          {SUPPLY_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.supply_type === t.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${
                data.supply_type === t.value ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <input type="radio" name="supply_type" checked={data.supply_type === t.value} onChange={() => update({ supply_type: t.value })} className="sr-only" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                  <span className="text-xs text-muted">({t.examples})</span>
                </div>
                <p className="text-xs text-muted">{t.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Emission model */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Modèle d'émission</h3>
        <div className="grid grid-cols-2 gap-2">
          {EMISSION_MODELS.map((m) => (
            <label
              key={m.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.emission_model === m.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${
                data.emission_model === m.value ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <input type="radio" name="emission_model" checked={data.emission_model === m.value} onChange={() => update({ emission_model: m.value })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{m.label}</p>
                <p className="text-xs text-muted">{m.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="label">Notes & justifications</label>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={3}
          className="input"
          placeholder="Pourquoi ce modèle ? Références à des projets similaires..."
        />
      </div>
    </ModuleShell>
  )
}
