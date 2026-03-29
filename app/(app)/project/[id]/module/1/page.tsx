'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M1Data, TokenType } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'

const DEFAULT: M1Data = {
  token_topology: null,
  gate_access: false,
  coordinate_risk: false,
  incentivize_actions: false,
  scale_with_usage: false,
  utility_score: 0,
  token_standard: null,
  social_impact_primitives: [],
  notes: '',
}

const TOKEN_TYPES: { value: TokenType; label: string; examples: string; description: string }[] = [
  { value: 'utility', label: 'Utility', examples: 'XRP, LINK, FIL', description: 'Requis pour utiliser le service' },
  { value: 'governance', label: 'Governance', examples: 'UNI, CRV, MKR', description: 'Droits de vote sur le protocole' },
  { value: 'security', label: 'Security', examples: 'tokenized equity', description: 'Représente une participation financière' },
  { value: 'stablecoin', label: 'Stablecoin', examples: 'USDC, DAI', description: 'Valeur stable, souvent adossée à un actif' },
  { value: 'hybrid', label: 'Hybrid', examples: 'AAVE, BNB', description: 'Combine plusieurs fonctions (utility + governance...)' },
]

const UTILITY_PRINCIPLES = [
  { key: 'gate_access' as const, label: 'Gate access', description: 'Restreint l\'accès à des services ou à des niveaux de service' },
  { key: 'coordinate_risk' as const, label: 'Coordinate risk', description: 'Staké/locké pour absorber du risque' },
  { key: 'incentivize_actions' as const, label: 'Incentivize actions', description: 'Récompense les bonnes actions, pénalise les mauvaises' },
  { key: 'scale_with_usage' as const, label: 'Scale with usage', description: 'La demande croît avec l\'activité réelle' },
]

const STANDARDS = ['ERC-20', 'ERC-721', 'ERC-1155', 'XLS-20', 'Custom'] as const

export default function Module1Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M1Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm1')
    if (mod) setData(mod.data as M1Data)
  }, [id])

  function update(patch: Partial<M1Data>) {
    setData((prev) => {
      const next = { ...prev, ...patch }
      next.utility_score = [next.gate_access, next.coordinate_risk, next.incentivize_actions, next.scale_with_usage].filter(Boolean).length
      return next
    })
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm1',
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
      title="Token Topology & Utility"
      subtitle="Module 1 — Quel est le rôle de votre token dans le système ?"
      projectId={id}
      moduleKey="m1"
      saved={saved}
      onSave={handleSave}
    >
      {/* Token Topology */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Type de token (Topology)</h3>
        <div className="grid grid-cols-1 gap-2">
          {TOKEN_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                data.token_topology === t.value
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:bg-surface-hover'
              }`}
            >
              <input
                type="radio"
                name="token_topology"
                value={t.value}
                checked={data.token_topology === t.value}
                onChange={() => update({ token_topology: t.value })}
                className="sr-only"
              />
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                data.token_topology === t.value ? 'border-accent bg-accent' : 'border-muted'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                  <span className="text-xs text-muted font-mono">({t.examples})</span>
                </div>
                <p className="text-xs text-muted">{t.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Utility principles */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Principes d'utilité</h3>
          <span className={`text-sm font-bold ${
            data.utility_score >= 3 ? 'text-green' :
            data.utility_score >= 2 ? 'text-yellow' : 'text-red'
          }`}>
            Score : {data.utility_score}/4
          </span>
        </div>
        <div className="space-y-2">
          {UTILITY_PRINCIPLES.map((p) => (
            <label
              key={p.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                data[p.key] ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
              }`}
            >
              <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                data[p.key] ? 'bg-accent border-accent' : 'border-muted'
              }`}>
                {data[p.key] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <input
                type="checkbox"
                checked={data[p.key]}
                onChange={(e) => update({ [p.key]: e.target.checked })}
                className="sr-only"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{p.label}</p>
                <p className="text-xs text-muted">{p.description}</p>
              </div>
            </label>
          ))}
        </div>
        {data.utility_score < 2 && data.utility_score > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-red/5 border border-red/20 text-xs text-red">
            ⚠ Score &lt; 2 — votre token risque d'être perçu comme spéculatif. Renforcez son utilité.
          </div>
        )}
      </div>

      {/* Token standard */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Standard technique</h3>
        <div className="flex flex-wrap gap-2">
          {STANDARDS.map((s) => (
            <button
              key={s}
              onClick={() => update({ token_standard: s })}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                data.token_standard === s
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <label className="label">Notes & réflexions</label>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Justifications, références à des projets similaires, questions ouvertes..."
          rows={4}
          className="input"
        />
      </div>
    </ModuleShell>
  )
}
