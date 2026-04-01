'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M4Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'
import { useLang } from '@/components/LangProvider'

const DEFAULT: M4Data = {
  total_supply: null,
  supply_type: null,
  emission_model: null,
  emission_phases: [],
  max_inflation_rate: null,
  notes: '',
}

const SUPPLY_TYPE_VALUES = ['fixed', 'inflationary', 'deflationary', 'elastic'] as const
const SUPPLY_TYPE_LABELS: Record<string, { label: string; examples: string }> = {
  fixed: { label: 'Fixed Supply', examples: 'BTC, ADA' },
  inflationary: { label: 'Inflationary', examples: 'ETH PoW, MATIC' },
  deflationary: { label: 'Deflationary', examples: 'XRP, BNB' },
  elastic: { label: 'Dynamic/Elastic', examples: 'ETH 2.0 PoS' },
}

const EMISSION_MODEL_VALUES = ['fixed', 'decaying', 'event_based', 'adaptive'] as const
const EMISSION_MODEL_LABELS: Record<string, string> = {
  fixed: 'Fixed',
  decaying: 'Decaying',
  event_based: 'Event-based',
  adaptive: 'Adaptive',
}

export default function Module4Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M4Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const { t } = useLang()

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

  const supplyTypeDescriptions: Record<string, string> = {
    fixed: t.m4_descFixed,
    inflationary: t.m4_descInflationary,
    deflationary: t.m4_descDeflationary,
    elastic: t.m4_descElastic,
  }

  const emissionModelDescriptions: Record<string, string> = {
    fixed: t.m4_descEmissionFixed,
    decaying: t.m4_descEmissionDecaying,
    event_based: t.m4_descEmissionEventBased,
    adaptive: t.m4_descEmissionAdaptive,
  }

  return (
    <ModuleShell
      title="Supply-Side & Emission Design"
      subtitle={t.m4_subtitle}
      projectId={id}
      moduleKey="m4"
      saved={saved}
      onSave={handleSave}
    >
      {/* Supply basics */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m4_supplyTitle}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.m4_totalSupplyLabel}</label>
            <input
              type="number"
              min="0"
              value={data.total_supply ?? ''}
              onChange={(e) => update({ total_supply: e.target.value ? Number(e.target.value) : null })}
              placeholder={t.m4_totalSupplyPlaceholder}
              className="input"
            />
            {data.total_supply && (
              <p className="text-xs text-muted mt-1">{formatNumber(data.total_supply)} tokens</p>
            )}
          </div>
          <div>
            <label className="label">{t.m4_inflationLabel}</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.max_inflation_rate ?? ''}
              onChange={(e) => update({ max_inflation_rate: e.target.value ? Number(e.target.value) : null })}
              placeholder={t.m4_inflationPlaceholder}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Supply type */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m4_supplyModelTitle}</h3>
        <div className="grid grid-cols-2 gap-2">
          {SUPPLY_TYPE_VALUES.map((val) => (
            <label
              key={val}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.supply_type === val ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${
                data.supply_type === val ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <input type="radio" name="supply_type" checked={data.supply_type === val} onChange={() => update({ supply_type: val })} className="sr-only" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground">{SUPPLY_TYPE_LABELS[val].label}</span>
                  <span className="text-xs text-muted">({SUPPLY_TYPE_LABELS[val].examples})</span>
                </div>
                <p className="text-xs text-muted">{supplyTypeDescriptions[val]}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Emission model */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m4_emissionModelTitle}</h3>
        <div className="grid grid-cols-2 gap-2">
          {EMISSION_MODEL_VALUES.map((val) => (
            <label
              key={val}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.emission_model === val ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${
                data.emission_model === val ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <input type="radio" name="emission_model" checked={data.emission_model === val} onChange={() => update({ emission_model: val })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{EMISSION_MODEL_LABELS[val]}</p>
                <p className="text-xs text-muted">{emissionModelDescriptions[val]}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="label">{t.m4_notesLabel}</label>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={3}
          className="input"
          placeholder={t.m4_notesPlaceholder}
        />
      </div>
    </ModuleShell>
  )
}
