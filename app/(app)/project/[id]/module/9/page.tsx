'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { M9Data } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useAutoSave } from '@/lib/useAutoSave'

const DEFAULT: M9Data = {
  jurisdictions: [],
  token_classification: null,
  kyc_required: false,
  regulatory_counsel: false,
  compliance_notes: '',
  notes: '',
}

const JURISDICTIONS = ['EU (MiCA)', 'US (SEC)', 'Dubai (VARA)', 'UK (FCA)', 'Singapore (MAS)', 'Switzerland (FINMA)', 'Autre']

export default function Module9Page() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<M9Data>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const mod = getLocalModuleData(id, 'm9')
    if (mod) setData(mod.data as M9Data)
  }, [id])

  function update(patch: Partial<M9Data>) {
    setData((p) => ({ ...p, ...patch }))
    setSaved(false)
  }

  function toggleJurisdiction(j: string) {
    setData((p) => ({
      ...p,
      jurisdictions: p.jurisdictions.includes(j) ? p.jurisdictions.filter((x) => x !== j) : [...p.jurisdictions, j],
    }))
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    saveLocalModuleData({
      id: generateId(),
      project_id: id,
      module_key: 'm9',
      data,
      ai_feedback: null,
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    })
    setSaved(true)
  }

  useAutoSave(data, handleSave)

  const showMiCA = data.jurisdictions.includes('EU (MiCA)')

  return (
    <ModuleShell
      title="Compliance"
      subtitle="Module 9 — Cadre réglementaire applicable à votre token"
      projectId={id}
      moduleKey="m9"
      saved={saved}
      onSave={handleSave}
    >
      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-yellow/5 border border-yellow/20 text-xs text-yellow">
        ⚠ Cette section est informative uniquement. Consultez un avocat spécialisé avant toute émission de token.
      </div>

      {/* Jurisdictions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Juridictions applicables</h3>
        <div className="flex flex-wrap gap-2">
          {JURISDICTIONS.map((j) => (
            <button
              key={j}
              onClick={() => toggleJurisdiction(j)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                data.jurisdictions.includes(j) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* Token classification */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Classification du token</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'utility', label: 'Utility Token', description: 'Accès à un service, pas de profit sharing' },
            { value: 'art', label: 'Asset-Referenced Token (ART)', description: 'MiCA — adossé à un actif ou panier' },
            { value: 'emt', label: 'E-Money Token (EMT)', description: 'MiCA — référencé à une devise fiat' },
            { value: 'security', label: 'Security Token', description: 'Droits financiers, soumis au droit des valeurs mobilières' },
            { value: 'unknown', label: 'À déterminer', description: 'Classification incertaine, nécessite avis juridique' },
          ].map((opt) => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.token_classification === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-hover'}`}>
              <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${data.token_classification === opt.value ? 'border-accent bg-accent' : 'border-muted'}`} />
              <input type="radio" name="token_classification" checked={data.token_classification === opt.value} onChange={() => update({ token_classification: opt.value as M9Data['token_classification'] })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* MiCA specifics */}
      {showMiCA && (
        <div className="card bg-surface-2">
          <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">MiCA — Obligations clés</h3>
          <ul className="text-xs text-muted space-y-1.5">
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Publication d'un whitepaper réglementaire</li>
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Autorisation préalable selon classification (ART/EMT)</li>
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Transparence continue (reporting périodique)</li>
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Séparer utility vs profit sharing dans le design</li>
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Structurer early (foundation / issuer / DAO)</li>
            <li className="flex gap-2"><span className="text-accent shrink-0">→</span>Engager le régulateur avant le TGE</li>
          </ul>
        </div>
      )}

      {/* Checklist */}
      <div className="card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Checklist conformité</h3>
        <div className="space-y-3">
          {[
            { key: 'kyc_required', label: 'KYC requis pour les participants', description: 'Vérification d\'identité des acheteurs/utilisateurs' },
            { key: 'regulatory_counsel', label: 'Conseil juridique engagé', description: 'Avocat spécialisé Web3/Crypto consulté' },
          ].map((item) => (
            <label key={item.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data[item.key as keyof M9Data] ? 'border-green bg-green/5' : 'border-border hover:bg-surface-hover'}`}>
              <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${data[item.key as keyof M9Data] ? 'bg-green border-green' : 'border-muted'}`}>
                {data[item.key as keyof M9Data] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <input type="checkbox" checked={!!data[item.key as keyof M9Data]} onChange={(e) => update({ [item.key]: e.target.checked })} className="sr-only" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted">{item.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="label">Notes de conformité</label>
          <textarea value={data.compliance_notes} onChange={(e) => update({ compliance_notes: e.target.value })} rows={3} className="input" placeholder="Actions en cours, délais, contacts régulateurs..." />
        </div>
      </div>

      <div className="card">
        <label className="label">Notes générales</label>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="input" />
      </div>
    </ModuleShell>
  )
}
