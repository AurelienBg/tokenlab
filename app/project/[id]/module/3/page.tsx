'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M3Data, FlowItem } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'

const DEFAULT: M3Data = {
  faucets: [],
  sinks: [],
  emission_revenue_ratio: null,
  notes: '',
}

function FlowList({
  items,
  title,
  color,
  placeholder,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: FlowItem[]
  title: string
  color: 'green' | 'red'
  placeholder: string
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<FlowItem>) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-semibold ${color === 'green' ? 'text-green' : 'text-red'}`}>{title}</h3>
        <button onClick={onAdd} className="btn btn-ghost text-xs">+ Ajouter</button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted">{placeholder}</p>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-lg border border-border bg-surface-2 space-y-2">
            <div className="flex gap-2">
              <input
                value={item.name}
                onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                placeholder="Nom"
                className="input flex-1"
              />
              <button onClick={() => onRemove(item.id)} className="text-muted hover:text-red transition-colors px-2">✕</button>
            </div>
            <input
              value={item.mechanism}
              onChange={(e) => onUpdate(item.id, { mechanism: e.target.value })}
              placeholder="Mécanisme (comment ça fonctionne ?)"
              className="input"
            />
            <input
              value={item.estimated_volume}
              onChange={(e) => onUpdate(item.id, { estimated_volume: e.target.value })}
              placeholder="Volume estimé (ex: 2% des fees, 100K tokens/mois)"
              className="input"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Module3Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M3Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm3')
    if (mod) setData(mod.data as M3Data)
  }, [id])

  function addFaucet() {
    setData((p) => ({ ...p, faucets: [...p.faucets, { id: generateId(), name: '', mechanism: '', estimated_volume: '' }] }))
    setSaved(false)
  }

  function updateFaucet(fid: string, patch: Partial<FlowItem>) {
    setData((p) => ({ ...p, faucets: p.faucets.map((f) => f.id === fid ? { ...f, ...patch } : f) }))
    setSaved(false)
  }

  function removeFaucet(fid: string) {
    setData((p) => ({ ...p, faucets: p.faucets.filter((f) => f.id !== fid) }))
    setSaved(false)
  }

  function addSink() {
    setData((p) => ({ ...p, sinks: [...p.sinks, { id: generateId(), name: '', mechanism: '', estimated_volume: '' }] }))
    setSaved(false)
  }

  function updateSink(sid: string, patch: Partial<FlowItem>) {
    setData((p) => ({ ...p, sinks: p.sinks.map((s) => s.id === sid ? { ...s, ...patch } : s) }))
    setSaved(false)
  }

  function removeSink(sid: string) {
    setData((p) => ({ ...p, sinks: p.sinks.filter((s) => s.id !== sid) }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm3',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  const ratio = data.emission_revenue_ratio

  return (
    <ModuleShell
      title="Value Flow — Sinks & Faucets"
      subtitle="Module 3 — Comment les tokens entrent et sortent du système ?"
      projectId={id}
      moduleKey="m3"
      saved={saved}
      onSave={handleSave}
    >
      <FlowList
        items={data.faucets}
        title="Token Faucets (sources)"
        color="green"
        placeholder="Aucun faucet. D'où viennent les tokens dans votre système ?"
        onAdd={addFaucet}
        onUpdate={updateFaucet}
        onRemove={removeFaucet}
      />

      <FlowList
        items={data.sinks}
        title="Token Sinks (destructions)"
        color="red"
        placeholder="Aucun sink. Comment les tokens sont-ils retirés du marché ?"
        onAdd={addSink}
        onUpdate={updateSink}
        onRemove={removeSink}
      />

      {/* Health KPI */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Health KPI — Ratio émission / revenus</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="label">Ratio estimé (émissions / revenus réels)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={ratio ?? ''}
              onChange={(e) => {
                const v = e.target.value === '' ? null : parseFloat(e.target.value)
                setData((p) => ({ ...p, emission_revenue_ratio: v }))
                setSaved(false)
              }}
              placeholder="ex: 0.8 = soutenable, 1.5 = risqué"
              className="input"
            />
          </div>
          {ratio !== null && (
            <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
              ratio <= 1 ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
            }`}>
              {ratio <= 1 ? '✓ Soutenable' : '⚠ Insoutenable'}
            </div>
          )}
        </div>
        {ratio !== null && ratio > 1 && (
          <p className="text-xs text-red mt-2">
            ⚠ Émissions &gt; Revenus — Introduisez des sinks supplémentaires avant les unlocks.
          </p>
        )}
      </div>

      <div className="card">
        <label className="label">Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) => { setData((p) => ({ ...p, notes: e.target.value })); setSaved(false) }}
          rows={3}
          className="input"
          placeholder="Schéma de flux, questions ouvertes..."
        />
      </div>
    </ModuleShell>
  )
}
