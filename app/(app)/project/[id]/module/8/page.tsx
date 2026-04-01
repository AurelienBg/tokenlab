'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M8Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'
import { useLang } from '@/components/LangProvider'

const DEFAULT: M8Data = {
  governance_model: null,
  voting_mechanism: '',
  quorum_threshold: null,
  proposal_threshold: null,
  timelock_hours: null,
  rights: [],
  notes: '',
}

// Stable keys used in data.rights storage
const RIGHTS_KEYS = ['Vote', 'Veto', 'Délégation', 'Gauge voting', 'Emergency action', 'Parameter change', 'Fee switch', 'Treasury allocation']

export default function Module8Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M8Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const { t } = useLang()

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

  useAutoSave(data, handleSave)

  // Map stable key → display label (translate Délégation only)
  const rightsLabels: Record<string, string> = {
    'Vote': 'Vote',
    'Veto': 'Veto',
    'Délégation': t.m8_rightDelegation,
    'Gauge voting': 'Gauge voting',
    'Emergency action': 'Emergency action',
    'Parameter change': 'Parameter change',
    'Fee switch': 'Fee switch',
    'Treasury allocation': 'Treasury allocation',
  }

  const govOptions = [
    { value: 'on_chain', label: t.m8_labelOnChain, description: t.m8_descOnChain },
    { value: 'off_chain', label: t.m8_labelOffChain, description: t.m8_descOffChain },
    { value: 'hybrid', label: t.m8_labelHybrid, description: t.m8_descHybrid },
    { value: 'none', label: t.m8_labelNone, description: t.m8_descNone },
  ]

  return (
    <ModuleShell
      title={t.m8_title}
      subtitle={t.m8_subtitle}
      projectId={id}
      moduleKey="m8"
      saved={saved}
      onSave={handleSave}
    >
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m8_govModelTitle}</h3>
        <div className="grid grid-cols-2 gap-2">
          {govOptions.map((opt) => (
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
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m8_rightsTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {RIGHTS_KEYS.map((right) => (
            <button
              key={right}
              onClick={() => toggleRight(right)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                data.rights.includes(right) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              {rightsLabels[right]}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t.m8_paramsTitle}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">{t.m8_quorumLabel}</label>
            <input type="number" min="0" max="100" value={data.quorum_threshold ?? ''} onChange={(e) => update({ quorum_threshold: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 4" className="input" />
          </div>
          <div>
            <label className="label">{t.m8_proposalLabel}</label>
            <input type="number" min="0" value={data.proposal_threshold ?? ''} onChange={(e) => update({ proposal_threshold: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 100000" className="input" />
          </div>
          <div>
            <label className="label">{t.m8_timelockLabel}</label>
            <input type="number" min="0" value={data.timelock_hours ?? ''} onChange={(e) => update({ timelock_hours: e.target.value ? Number(e.target.value) : null })} placeholder="ex: 48" className="input" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">{t.m8_votingMechanismLabel}</label>
          <input value={data.voting_mechanism} onChange={(e) => update({ voting_mechanism: e.target.value })} placeholder={t.m8_votingMechanismPlaceholder} className="input" />
        </div>
      </div>

      <div className="card">
        <label className="label">{t.m8_notesLabel}</label>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="input" placeholder={t.m8_notesPlaceholder} />
      </div>
    </ModuleShell>
  )
}
