'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M2Data, Agent, Policy } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'

const DEFAULT: M2Data = { agents: [], policies: [], notes: '' }

const AGENT_CATEGORIES = ['End users', 'Capital providers (LPs, insurers)', 'Validators & oracles', 'Institutions (NGOs, lenders)', 'Infra service providers', 'DAO members', 'Autre']
const POLICY_TYPES = ['Fee Rebate Policy', 'Access Policy', 'POL Accumulation Rule', 'Dynamic APR Controller', 've-Weighted Emission Policy', 'Revenue-Share Rule', 'Treasury Allocation', 'Slashing Policy', 'Custom']

export default function Module2Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M2Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm2')
    if (mod) setData(mod.data as M2Data)
  }, [id])

  function addAgent() {
    setData((prev) => ({
      ...prev,
      agents: [...prev.agents, { id: generateId(), name: '', category: 'End users', incentive: '' }],
    }))
    setSaved(false)
  }

  function updateAgent(agentId: string, patch: Partial<Agent>) {
    setData((prev) => ({
      ...prev,
      agents: prev.agents.map((a) => a.id === agentId ? { ...a, ...patch } : a),
    }))
    setSaved(false)
  }

  function removeAgent(agentId: string) {
    setData((prev) => ({ ...prev, agents: prev.agents.filter((a) => a.id !== agentId) }))
    setSaved(false)
  }

  function addPolicy() {
    setData((prev) => ({
      ...prev,
      policies: [...prev.policies, { id: generateId(), name: '', description: '', type: 'Custom' }],
    }))
    setSaved(false)
  }

  function updatePolicy(pid: string, patch: Partial<Policy>) {
    setData((prev) => ({
      ...prev,
      policies: prev.policies.map((p) => p.id === pid ? { ...p, ...patch } : p),
    }))
    setSaved(false)
  }

  function removePolicy(pid: string) {
    setData((prev) => ({ ...prev, policies: prev.policies.filter((p) => p.id !== pid) }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm2',
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
      title="Agents & Policies"
      subtitle="Module 2 — Qui interagit avec le système, et selon quelles règles ?"
      projectId={id}
      moduleKey="m2"
      saved={saved}
      onSave={handleSave}
    >
      {/* Agents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Agents</h3>
          <button onClick={addAgent} className="btn btn-ghost text-xs">+ Ajouter</button>
        </div>
        {data.agents.length === 0 && (
          <p className="text-xs text-muted">Aucun agent. Qui interagit avec votre système ?</p>
        )}
        <div className="space-y-3">
          {data.agents.map((agent) => (
            <div key={agent.id} className="p-3 rounded-lg border border-border bg-surface-2 space-y-2">
              <div className="flex gap-2">
                <input
                  value={agent.name}
                  onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                  placeholder="Nom de l'agent"
                  className="input flex-1"
                />
                <select
                  value={agent.category}
                  onChange={(e) => updateAgent(agent.id, { category: e.target.value })}
                  className="input w-52"
                >
                  {AGENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button onClick={() => removeAgent(agent.id)} className="text-muted hover:text-red transition-colors px-2">✕</button>
              </div>
              <input
                value={agent.incentive}
                onChange={(e) => updateAgent(agent.id, { incentive: e.target.value })}
                placeholder="Quelle est son incitation à participer ?"
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Policies</h3>
          <button onClick={addPolicy} className="btn btn-ghost text-xs">+ Ajouter</button>
        </div>
        {data.policies.length === 0 && (
          <p className="text-xs text-muted">Aucune policy. Quelles règles gouvernent votre système ?</p>
        )}
        <div className="space-y-3">
          {data.policies.map((policy) => (
            <div key={policy.id} className="p-3 rounded-lg border border-border bg-surface-2 space-y-2">
              <div className="flex gap-2">
                <input
                  value={policy.name}
                  onChange={(e) => updatePolicy(policy.id, { name: e.target.value })}
                  placeholder="Nom de la policy"
                  className="input flex-1"
                />
                <select
                  value={policy.type}
                  onChange={(e) => updatePolicy(policy.id, { type: e.target.value })}
                  className="input w-52"
                >
                  {POLICY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => removePolicy(policy.id)} className="text-muted hover:text-red transition-colors px-2">✕</button>
              </div>
              <textarea
                value={policy.description}
                onChange={(e) => updatePolicy(policy.id, { description: e.target.value })}
                placeholder="Décrivez la règle, son déclencheur, et son impact"
                rows={2}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="label">Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) => { setData((p) => ({ ...p, notes: e.target.value })); setSaved(false) }}
          rows={3}
          className="input"
          placeholder="Questions ouvertes, incohérences à résoudre..."
        />
      </div>
    </ModuleShell>
  )
}
