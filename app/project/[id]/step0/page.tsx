'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { Step0Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'

const DEFAULT: Step0Data = {
  needs_token: null,
  gate_access: false,
  absorb_risk: false,
  capture_value: false,
  impact_verified: false,
  rationale: '',
  result: null,
}

export default function Step0Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<Step0Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'step0')
    if (mod) setData(mod.data as Step0Data)
  }, [id])

  function computeResult(d: Step0Data): 'launch' | 'rethink' | null {
    if (d.needs_token === null) return null
    if (!d.needs_token) return 'rethink'
    const score = [d.gate_access, d.absorb_risk, d.capture_value].filter(Boolean).length
    return score >= 2 ? 'launch' : 'rethink'
  }

  function handleChange(field: keyof Step0Data, value: boolean | null | string) {
    setData((prev) => {
      const next = { ...prev, [field]: value }
      next.result = computeResult(next)
      return next
    })
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    const updated = { ...data, result: computeResult(data) }
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'step0',
      data: updated,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  const result = computeResult(data)

  return (
    <ModuleShell
      title="Token Decision Tree"
      subtitle="Étape 0 — Avant de designer votre tokenomics, avez-vous vraiment besoin d'un token ?"
      projectId={id}
      moduleKey="step0"
      saved={saved}
      onSave={handleSave}
    >
      <div className="space-y-8">
        {/* Q1 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Question 1 : Un token est-il nécessaire pour votre projet ?
          </h3>
          <p className="text-xs text-muted mb-4">
            Les utilisateurs peuvent-ils pleinement utiliser le produit sans le token ?
          </p>
          <div className="flex gap-3">
            {([true, false] as const).map((val) => (
              <button
                key={String(val)}
                onClick={() => handleChange('needs_token', val)}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  data.needs_token === val
                    ? val
                      ? 'border-green bg-green/10 text-green'
                      : 'border-red bg-red/10 text-red'
                    : 'border-border text-muted hover:bg-surface-hover'
                }`}
              >
                {val ? '✓ Oui, le token est nécessaire' : '✗ Non, le token n\'est pas nécessaire'}
              </button>
            ))}
          </div>
          {data.needs_token === false && (
            <div className="mt-3 p-3 rounded-lg bg-red/5 border border-red/20 text-xs text-red">
              ⚠ Recommandation : utilisez des stablecoins ou des paiements fiat plutôt qu'un token natif.
            </div>
          )}
        </div>

        {/* Q2 */}
        {data.needs_token === true && (
          <div className="card">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Question 2 : Le token verrouille-t-il l'accès ou absorbe-t-il du risque ?
            </h3>
            <p className="text-xs text-muted mb-4">
              Sélectionnez toutes les propriétés qui s'appliquent à votre token.
            </p>
            <div className="space-y-3">
              <Checkbox
                checked={data.gate_access}
                onChange={(v) => handleChange('gate_access', v)}
                label="Gate access"
                description="Le token verrouille l'accès ou crée des niveaux de service"
              />
              <Checkbox
                checked={data.absorb_risk}
                onChange={(v) => handleChange('absorb_risk', v)}
                label="Absorb risk"
                description="Le token est staké/locké pour absorber du risque (ex: insurance)"
              />
              <Checkbox
                checked={data.capture_value}
                onChange={(v) => handleChange('capture_value', v)}
                label="Capture value"
                description="Le token capture de la valeur réelle (cash flows, revenus — pas d'émission spéculative)"
              />
              <Checkbox
                checked={data.impact_verified}
                onChange={(v) => handleChange('impact_verified', v)}
                label="Impact verified"
                description="L'impact est vérifié (data oracles + payouts automatiques, pas de claims déclaratifs)"
              />
            </div>

            {([data.gate_access, data.absorb_risk, data.capture_value].filter(Boolean).length === 0) && (
              <div className="mt-3 p-3 rounded-lg bg-yellow/5 border border-yellow/20 text-xs text-yellow">
                ⚠ Aucune propriété sélectionnée — votre token risque d'être non-critique pour le système.
              </div>
            )}
          </div>
        )}

        {/* Rationale */}
        <div className="card">
          <label className="label">Justification (notes)</label>
          <textarea
            value={data.rationale}
            onChange={(e) => handleChange('rationale', e.target.value)}
            placeholder="Expliquez pourquoi votre token est nécessaire et ce qu'il permet que les alternatives (stablecoins, fiat) ne permettent pas..."
            rows={4}
            className="input"
          />
        </div>

        {/* Result */}
        {result && (
          <div className={`card border-2 ${
            result === 'launch'
              ? 'border-green bg-green/5'
              : 'border-yellow bg-yellow/5'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{result === 'launch' ? '✅' : '⚠️'}</span>
              <div>
                <p className={`font-semibold ${result === 'launch' ? 'text-green' : 'text-yellow'}`}>
                  {result === 'launch' ? 'Launch with utilities' : 'Rethink the token'}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {result === 'launch'
                    ? 'Votre token couvre au moins 2 propriétés clés. Vous pouvez passer aux modules suivants.'
                    : 'Faible utilité détectée. Reconsidérez si le token est vraiment nécessaire avant de continuer.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  )
}

function Checkbox({
  checked, onChange, label, description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
      checked ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'
    }`}>
      <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
        checked ? 'bg-accent border-accent' : 'border-border'
      }`}>
        {checked && <span className="text-white text-[10px]">✓</span>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </label>
  )
}
