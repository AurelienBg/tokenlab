'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { Step0Data, TokenRecommendation } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useLang } from '@/components/LangProvider'

const DEFAULT: Step0Data = {
  needs_token: null,
  primary_function: null,
  demand_driver: null,
  rationale: '',
  result: null,
  gate_access: false,
  absorb_risk: false,
  capture_value: false,
  impact_verified: false,
}

function computeRecommendation(d: Step0Data): TokenRecommendation | null {
  if (d.needs_token === null) return null
  if (!d.needs_token) return 'rethink'
  if (!d.primary_function) return null
  if (d.primary_function === 'stable') return 'stablecoin'
  if (d.primary_function === 'governance') return 'governance'
  if (d.primary_function === 'hybrid') return 'hybrid'
  if (d.primary_function === 'value' && d.demand_driver === 'investors') return 'security'
  return 'utility'
}

const RECS = {
  utility:    { icon: '🔐', color: 'green',  label: { fr: 'Utility Token',         en: 'Utility Token'    }, desc: { fr: 'Requis pour accéder ou utiliser le protocole — utilité réelle forte.',             en: 'Required to access or use the protocol — strong real utility.'             } },
  governance: { icon: '⚖️', color: 'accent', label: { fr: 'Governance Token',       en: 'Governance Token' }, desc: { fr: 'Droits de vote sur le protocole. Évitez la concentration du pouvoir.',             en: 'Voting rights on the protocol. Avoid power concentration.'                 } },
  security:   { icon: '💰', color: 'yellow', label: { fr: 'Security Token',         en: 'Security Token'   }, desc: { fr: 'Participation financière. Soumis à la réglementation (MiCA, SEC). Consultez un juriste.', en: 'Financial stake. Subject to regulation (MiCA, SEC). Consult a lawyer.'  } },
  stablecoin: { icon: '💱', color: 'accent', label: { fr: 'Stablecoin',             en: 'Stablecoin'       }, desc: { fr: 'Valeur stable adossée à un actif ou algorithmique.',                               en: 'Stable value backed by an asset or algorithmic.'                           } },
  hybrid:     { icon: '🔀', color: 'accent', label: { fr: 'Hybrid Token',           en: 'Hybrid Token'     }, desc: { fr: 'Combine plusieurs fonctions. Définissez clairement chaque rôle.',                  en: 'Combines multiple functions. Define each role clearly.'                     } },
  rethink:    { icon: '🔄', color: 'yellow', label: { fr: 'Repensez le token',      en: 'Rethink the token'}, desc: { fr: 'Votre produit peut fonctionner sans token natif. Envisagez stablecoins ou fiat.',   en: 'Your product can work without a native token. Consider stablecoins or fiat.'} },
} as const

export default function Step0Page() {
  const { id } = useParams() as { id: string }
  const { t, lang } = useLang()
  const [data, setData] = useState<Step0Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const fr = lang === 'fr'

  useEffect(() => {
    const mod = getLocalModuleData(id, 'step0')
    if (mod) setData({ ...DEFAULT, ...(mod.data as Step0Data) })
  }, [id])

  function update(patch: Partial<Step0Data>) {
    setData(prev => {
      const next = { ...prev, ...patch }
      next.result = computeRecommendation(next)
      return next
    })
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    const final = { ...data, result: computeRecommendation(data) }
    saveLocalModuleData({ id: generateId(), project_id: id, module_key: 'step0', data: final, ai_feedback: null, is_complete: isComplete, updated_at: new Date().toISOString() })
    setSaved(true)
  }

  const rec = data.result ? RECS[data.result] : null
  const needsQ3 = data.needs_token === true && data.primary_function && !['stable', 'hybrid', 'governance'].includes(data.primary_function)

  return (
    <ModuleShell title="Token Decision Tree" subtitle={t.step0_subtitle} projectId={id} moduleKey="step0" saved={saved} onSave={handleSave}>
      <div className="space-y-6">

        {/* Q1 */}
        <div className="card">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-2">{fr ? 'Question 1 / 3' : 'Question 1 / 3'}</p>
          <h3 className="text-sm font-semibold text-foreground mb-4">
            {fr ? 'Votre produit nécessite-t-il vraiment un token ?' : 'Does your product truly require a token?'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as const).map(val => (
              <button key={String(val)} onClick={() => update({ needs_token: val, primary_function: val ? data.primary_function : null, demand_driver: val ? data.demand_driver : null })}
                className={`p-4 rounded-xl border text-sm text-left transition-colors ${data.needs_token === val ? (val ? 'border-green bg-green/10 text-green' : 'border-yellow bg-yellow/10 text-yellow') : 'border-border text-muted hover:bg-surface-hover'}`}>
                <div className="text-xl mb-2">{val ? '✓' : '✗'}</div>
                <p className="text-xs font-medium">{val ? (fr ? 'Oui — essentiel au système' : 'Yes — core to the system') : (fr ? 'Non — fiat ou stablecoin suffirait' : 'No — fiat or stablecoin would work')}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        {data.needs_token === true && (
          <div className="card">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2">{fr ? 'Question 2 / 3' : 'Question 2 / 3'}</p>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {fr ? 'Quelle est la fonction principale du token ?' : "What is the token's primary function?"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'access',     icon: '🔐', fr: 'Accès & niveaux de service',          en: 'Access gating & service tiers'       },
                { value: 'governance', icon: '⚖️', fr: 'Gouvernance & vote',                   en: 'Governance & voting'                 },
                { value: 'value',      icon: '💰', fr: 'Capture de valeur (fees, revenus)',    en: 'Value capture (fees, revenue)'       },
                { value: 'risk',       icon: '🔒', fr: 'Absorber du risque (staking)',          en: 'Risk absorption (staking)'           },
                { value: 'stable',     icon: '💱', fr: 'Valeur stable (stablecoin)',            en: 'Stable value (stablecoin)'           },
                { value: 'hybrid',     icon: '🔀', fr: 'Plusieurs fonctions combinées',         en: 'Multiple combined functions'         },
              ] as const).map(opt => (
                <button key={opt.value} onClick={() => update({ primary_function: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-colors ${data.primary_function === opt.value ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'}`}>
                  <span className="text-lg">{opt.icon}</span>
                  <p className="mt-1 text-xs font-medium">{fr ? opt.fr : opt.en}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3 */}
        {needsQ3 && (
          <div className="card">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2">{fr ? 'Question 3 / 3' : 'Question 3 / 3'}</p>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {fr ? 'Qui crée la demande pour le token ?' : 'Who drives demand for the token?'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'usage',     icon: '⚡', fr: 'Utilisateurs du protocole',          en: 'Protocol users'              },
                { value: 'community', icon: '🏛', fr: 'Communauté / DAO',                   en: 'Community / DAO'             },
                { value: 'investors', icon: '📈', fr: 'Investisseurs (rendement attendu)',   en: 'Investors (expected return)' },
                { value: 'mixed',     icon: '🌐', fr: 'Combinaison des trois',               en: 'Combination of all'          },
              ] as const).map(opt => (
                <button key={opt.value} onClick={() => update({ demand_driver: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-colors ${data.demand_driver === opt.value ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:bg-surface-hover hover:text-foreground'}`}>
                  <span className="text-lg">{opt.icon}</span>
                  <p className="mt-1 text-xs font-medium">{fr ? opt.fr : opt.en}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {rec && (
          <div className={`card border-2 ${rec.color === 'green' ? 'border-green/40 bg-green/5' : rec.color === 'yellow' ? 'border-yellow/40 bg-yellow/5' : 'border-accent/40 bg-accent/5'}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">{rec.icon}</span>
              <div>
                <p className={`text-sm font-bold mb-1 ${rec.color === 'green' ? 'text-green' : rec.color === 'yellow' ? 'text-yellow' : 'text-accent'}`}>
                  {fr ? 'Recommandation :' : 'Recommendation:'} {fr ? rec.label.fr : rec.label.en}
                </p>
                <p className="text-xs text-muted">{fr ? rec.desc.fr : rec.desc.en}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rationale */}
        <div className="card">
          <label className="label">{t.step0_rationaleLabel}</label>
          <textarea value={data.rationale} onChange={e => update({ rationale: e.target.value })} placeholder={t.step0_rationalePlaceholder} rows={3} className="input" />
        </div>

      </div>
    </ModuleShell>
  )
}
