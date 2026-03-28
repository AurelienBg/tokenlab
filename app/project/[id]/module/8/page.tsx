'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M8Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'

const DEFAULT: M8Data = {
  governance_model: null,
  voting_mechanism: '',
  quorum_threshold: null,
  proposal_threshold: null,
  timelock_hours: null,
  rights: [],
  notes: '',
}

const RIGHTS_OPTIONS = ['Vote', 'Veto', 'Délégation', 'Gauge voting', 'Emergency action', 'Parameter change', 'Fee switch', 'Treasury allocation']

export default function Module8Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M8Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm8')
    if (mod) setData(mod.data as M8Data)
  }, [id])

  function update(patch: Partial<M8Data>) {
    setData((p) => ({ ...p, ...patch }))
    setSaved(false)
  }

  function toggleRight(right: string) {
    setData((p) => ({
      ...p,
      rights: p.rights.includes(right) ? p.rights.filter((r) => r !== right) : [...p.rights, right],
    }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm8',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  return (
    <ModuleShell
      title="Gouvernance"
      subtitle="Module 8 — Modèle de gouvernance et droits associés au token"
      projectId={id}
      moduleKey="m8"
      saved={saved}
      onSave={handleSave}
    >
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Modèle de gouvernance</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'on_chain', label: 'On-chain', description: 'Votes enregistrés et exécutés on-chain' },
            { value: 'off_chain', label: 'Off-chain', description: 'Snapshot, forums, multisig exécution' },
            { value: 'hybrid', label: 'Hybride', description: 'Délibération off-chain, exécution on-chain' },
            { value: 'none', label: 'Aucune (pour l\'instant)', description: 'Token sans droits de gouvernance' },
          ].map((opt) => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.governance_model === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'}`}>
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${data.governance_model === opt.value ? 'border-accent bg-accent' : 'border-muted'}`} />
              <input type="radio" name="governance_model" checked={data.governance_model === opt.value} onChange={() => update({ governance_model: opt.value as M8Data['governance_model'] })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Droits associés au token</h3>
        <div className="flex flex-wrap gap-2">
          {RIGHTS_OPTIONS.map((right) => (
            <button
              key={right}
              onClick={() => toggleRight(right)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                data.rights.includes(right) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Paramètres</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Quorum (%)</label>
            <input type="number" min="0" max="100" value={data.quorum_threshold ?? ''} onChange={(e) => update({ quorum_threshold: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 4" className="input" />
          </div>
          <div>
            <label className="label">Seuil de proposition (tokens)</label>
            <input type="number" min="0" value={data.proposal_threshold ?? ''} onChange={(e) => update({ proposal_threshold: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 100000" className="input" />
          </div>
          <div>
            <label className="label">Timelock (heures)</label>
            <input type="number" min="0" value={data.timelock_hours ?? ''} onChange={(e) => update({ timelock_hours: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 48" className="input" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Mécanisme de vote</label>
          <input value={data.voting_mechanism} onChange={(e) => update({ voting_mechanism: e.target.value })} placeholder="ex: token-weighted, quadratic, conviction voting, ve-model" className="input" />
        </div>
      </div>

      <div className="card">
        <label className="label">Notes</label>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="input" placeholder="Questions ouvertes sur la gouvernance, risques de centralisation..." />
      </div>
    </ModuleShell>
  )
}
