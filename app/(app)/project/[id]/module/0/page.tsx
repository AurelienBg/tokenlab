'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalModuleData, saveLocalModuleData, generateId } from '@/lib/storage'
import { Step0Data, TokenRecommendation } from '@/lib/types'
import ModuleShell from '@/components/ModuleShell'
import { useLang } from '@/components/LangProvider'

// ─── Scoring ──────────────────────────────────────────────────────────────────

type TokenResult = 'fungible' | 'stablecoin' | 'mpt' | 'nft'

const SCORING: Record<string, Partial<Record<TokenResult, number>>> = {
  q1_a: { fungible: 3, stablecoin: 1 },
  q1_b: { nft: 3 },
  q1_c: { stablecoin: 3 },
  q1_d: { mpt: 2, nft: 1 },
  q2_a: { fungible: 2 },
  q2_b: { nft: 2 },
  q2_c: { stablecoin: 2 },
  q2_d: { mpt: 3 },
  q3_a: { fungible: 2, stablecoin: 1 },
  q3_b: { nft: 3 },
  q3_c: { mpt: 2, nft: 1 },
  q3_d: { stablecoin: 3 },
  q4_a: { fungible: 3 },
  q4_b: { mpt: 3 },
  q4_c: { mpt: 2, stablecoin: 1 },
  q4_d: { nft: 3 },
}

function computeResult(q1: string | null, q2: string | null, q3: string | null, q4: string | null): TokenResult | null {
  const scores: Record<TokenResult, number> = { fungible: 0, stablecoin: 0, mpt: 0, nft: 0 }
  const answered = [q1, q2, q3, q4].filter(Boolean).length
  if (answered < 2) return null
  ;[['q1', q1], ['q2', q2], ['q3', q3], ['q4', q4]].forEach(([k, v]) => {
    if (!v) return
    const pts = SCORING[`${k}_${v}`]
    if (pts) Object.entries(pts).forEach(([t, s]) => { scores[t as TokenResult] += s! })
  })
  const max = Math.max(...Object.values(scores))
  if (max === 0) return null
  return (Object.entries(scores).find(([, s]) => s === max)?.[0] as TokenResult) ?? null
}

// ─── Content ──────────────────────────────────────────────────────────────────

const QUESTIONS_FR = [
  {
    key: 'q1',
    question: 'Qu\'est-ce que votre token représente fondamentalement ?',
    options: [
      { id: 'a', text: 'Une unité d\'échange ou d\'accès — chaque token donne droit à un service, une récompense ou une participation dans le protocole' },
      { id: 'b', text: 'Un objet unique et identifiable — certificat de propriété, œuvre numérique, actif physique représenté on-chain' },
      { id: 'c', text: 'Une valeur stable — ancré au dollar, à l\'euro ou à un panier d\'actifs pour faciliter les paiements' },
      { id: 'd', text: 'Une part dans un actif réel — immobilier, obligation, fonds d\'investissement avec des droits et obligations associés' },
    ],
  },
  {
    key: 'q2',
    question: 'Comment vos utilisateurs utilisent-ils concrètement ce token ?',
    options: [
      { id: 'a', text: 'Ils l\'échangent librement, paient des frais de protocole ou débloquent des fonctionnalités' },
      { id: 'b', text: 'Ils le possèdent comme un objet de collection ou une preuve unique — chaque token a sa propre histoire' },
      { id: 'c', text: 'Ils s\'en servent comme monnaie de compte stable, pour payer ou stocker de la valeur sans volatilité' },
      { id: 'd', text: 'Ils détiennent sous conditions — KYC requis, approbation de l\'émetteur pour transférer, obligations de compliance' },
    ],
  },
  {
    key: 'q3',
    question: 'Est-ce que tous vos tokens se valent et sont interchangeables ?',
    options: [
      { id: 'a', text: 'Oui, complètement — 1 token = 1 token, peu importe lequel, comme des billets de banque' },
      { id: 'b', text: 'Non, chaque token est distinct — numéro de série unique, attributs propres, historique de propriété traçable' },
      { id: 'c', text: 'En partie — même valeur faciale mais droits, métadonnées ou restrictions différents selon le détenteur' },
      { id: 'd', text: 'La parité de valeur prime — ce qui compte c\'est la stabilité et la convertibilité, pas l\'unicité' },
    ],
  },
  {
    key: 'q4',
    question: 'Qui contrôle ou supervise les transferts ?',
    options: [
      { id: 'a', text: 'Personne — protocole ouvert et permissionless, les utilisateurs transfèrent librement sans permission tierce' },
      { id: 'b', text: 'L\'émetteur — peut geler des comptes, appliquer des frais de transfert automatiques ou whitelist des adresses' },
      { id: 'c', text: 'Un régulateur ou tiers de confiance — KYC/AML obligatoire, liste blanche d\'adresses agréées, conformité financière' },
      { id: 'd', text: 'La question du contrôle est secondaire — ce qui prime c\'est la preuve d\'unicité et d\'authenticité de chaque token' },
    ],
  },
]

const QUESTIONS_EN = [
  {
    key: 'q1',
    question: 'What does your token fundamentally represent?',
    options: [
      { id: 'a', text: 'A unit of exchange or access — each token grants rights to a service, reward, or participation in the protocol' },
      { id: 'b', text: 'A unique, identifiable object — certificate of ownership, digital artwork, or physical asset represented on-chain' },
      { id: 'c', text: 'A stable value — pegged to the dollar, euro, or a basket of assets to facilitate payments' },
      { id: 'd', text: 'A share in a real-world asset — real estate, bonds, or investment fund with associated rights and obligations' },
    ],
  },
  {
    key: 'q2',
    question: 'How do your users concretely use this token?',
    options: [
      { id: 'a', text: 'They trade it freely, pay protocol fees, or unlock features' },
      { id: 'b', text: 'They own it as a collectible or unique proof — each token has its own story and provenance' },
      { id: 'c', text: 'They use it as a stable unit of account — paying or storing value without price volatility' },
      { id: 'd', text: 'They hold it under conditions — KYC required, issuer approval to transfer, compliance obligations' },
    ],
  },
  {
    key: 'q3',
    question: 'Are all your tokens equal and interchangeable?',
    options: [
      { id: 'a', text: 'Yes, completely — 1 token = 1 token, regardless of which one, like banknotes' },
      { id: 'b', text: 'No, each token is distinct — unique serial number, own attributes, traceable ownership history' },
      { id: 'c', text: 'Partially — same face value but different rights, metadata, or restrictions per holder' },
      { id: 'd', text: 'Value parity matters most — stability and convertibility are key, uniqueness is secondary' },
    ],
  },
  {
    key: 'q4',
    question: 'Who controls or supervises transfers?',
    options: [
      { id: 'a', text: 'No one — open permissionless protocol, users transfer freely without third-party permission' },
      { id: 'b', text: 'The issuer — can freeze accounts, apply automatic transfer fees, or whitelist addresses' },
      { id: 'c', text: 'A regulator or trusted third party — mandatory KYC/AML, approved address whitelist, financial compliance' },
      { id: 'd', text: 'Control is secondary — what matters is proof of uniqueness and authenticity for each token' },
    ],
  },
]

const RESULTS: Record<TokenResult, {
  icon: string
  color: 'green' | 'yellow' | 'accent'
  label: { fr: string; en: string }
  desc: { fr: string; en: string }
  standard: { fr: string; en: string }
}> = {
  fungible: {
    icon: '🔐',
    color: 'green',
    label: { fr: 'Token Fongible', en: 'Fungible Token' },
    desc: {
      fr: 'Interchangeable et libre — idéal pour l\'accès au protocole, la gouvernance, les récompenses et l\'économie DeFi. Chaque token est identique à tous les autres.',
      en: 'Interchangeable and permissionless — ideal for protocol access, governance, rewards, and DeFi economy. Each token is identical to all others.',
    },
    standard: { fr: 'Standard : IOU / Trust Line (XRPL) ou ERC-20', en: 'Standard: IOU / Trust Line (XRPL) or ERC-20' },
  },
  stablecoin: {
    icon: '💱',
    color: 'accent',
    label: { fr: 'Stablecoin', en: 'Stablecoin' },
    desc: {
      fr: 'Valeur stable adossée à un actif réel (fiat, or, panier). Requiert un mécanisme de stabilisation (collatéral ou algorithme) et souvent une infrastructure de conformité.',
      en: 'Stable value backed by a real asset (fiat, gold, basket). Requires a stabilization mechanism (collateral or algorithm) and often compliance infrastructure.',
    },
    standard: { fr: 'Exemples : USDC, RLUSD, EURC', en: 'Examples: USDC, RLUSD, EURC' },
  },
  mpt: {
    icon: '⚙️',
    color: 'yellow',
    label: { fr: 'MPT — Multi-Purpose Token', en: 'MPT — Multi-Purpose Token' },
    desc: {
      fr: 'Token fongible natif XRPL (XLS-33) avec contrôle émetteur. Frais de transfert programmables, gel de compte, métadonnées on-chain. Idéal pour les actifs réglementés, RWA fongibles et stablecoins avec KYC.',
      en: 'Native XRPL fungible token (XLS-33) with issuer control. Programmable transfer fees, account freeze, on-chain metadata. Ideal for regulated assets, fungible RWAs, and KYC-gated stablecoins.',
    },
    standard: { fr: 'Standard : XLS-33 (MPT natif XRPL)', en: 'Standard: XLS-33 (XRPL native MPT)' },
  },
  nft: {
    icon: '🖼',
    color: 'accent',
    label: { fr: 'NFT — Token Non-Fongible', en: 'NFT — Non-Fungible Token' },
    desc: {
      fr: 'Chaque token est unique et traçable on-chain. Parfait pour les actifs physiques numérisés, certificats d\'authenticité, œuvres d\'art numériques ou preuves de participation.',
      en: 'Each token is unique and traceable on-chain. Perfect for digitized physical assets, certificates of authenticity, digital artwork, or proof of participation.',
    },
    standard: { fr: 'Standard : XLS-20 (NFT natif XRPL)', en: 'Standard: XLS-20 (XRPL native NFT)' },
  },
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT: Step0Data = {
  needs_token: null,
  primary_function: null,
  demand_driver: null,
  rationale: '',
  result: null,
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  gate_access: false,
  absorb_risk: false,
  capture_value: false,
  impact_verified: false,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Step0Page() {
  const { id } = useParams() as { id: string }
  const { t, lang } = useLang()
  const [data, setData] = useState<Step0Data>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const fr = lang === 'fr'

  const questions = fr ? QUESTIONS_FR : QUESTIONS_EN

  useEffect(() => {
    const mod = getLocalModuleData(id, 'step0')
    if (mod) setData({ ...DEFAULT, ...(mod.data as Step0Data) })
  }, [id])

  function update(patch: Partial<Step0Data>) {
    setData(prev => {
      const next = { ...prev, ...patch }
      const raw = computeResult(next.q1, next.q2, next.q3, next.q4)
      next.result = raw as TokenRecommendation | null
      return next
    })
    setSaved(false)
  }

  function handleSave(isComplete: boolean) {
    const final = { ...data, result: computeResult(data.q1, data.q2, data.q3, data.q4) as TokenRecommendation | null }
    saveLocalModuleData({ id: generateId(), project_id: id, module_key: 'step0', data: final, ai_feedback: null, is_complete: isComplete, updated_at: new Date().toISOString() })
    setSaved(true)
  }

  const answers: Record<string, string | null> = { q1: data.q1, q2: data.q2, q3: data.q3, q4: data.q4 }
  const result = computeResult(data.q1, data.q2, data.q3, data.q4)
  const rec = result ? RESULTS[result] : null
  const answeredCount = [data.q1, data.q2, data.q3, data.q4].filter(Boolean).length

  return (
    <ModuleShell title="Token Type" subtitle={t.step0_subtitle} projectId={id} moduleKey="step0" saved={saved} onSave={handleSave}>
      <div className="space-y-5">

        {/* Intro */}
        <div className="card bg-surface-2 border-border">
          <p className="text-xs text-muted leading-relaxed">
            {fr
              ? 'Répondez aux 4 questions ci-dessous pour identifier le type de token le mieux adapté à votre projet. Le résultat se met à jour en temps réel dès 2 réponses.'
              : 'Answer the 4 questions below to identify the token type best suited for your project. The result updates in real-time after 2 answers.'}
          </p>
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div key={q.key} className="card">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2">
              {fr ? `Question ${qi + 1} / 4` : `Question ${qi + 1} / 4`}
            </p>
            <h3 className="text-sm font-semibold text-foreground mb-4">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map(opt => {
                const selected = answers[q.key] === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => update({ [q.key]: selected ? null : opt.id } as Partial<Step0Data>)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                      selected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:bg-surface-hover hover:text-foreground hover:border-accent/30'
                    }`}
                  >
                    <span className={`inline-block w-5 h-5 rounded-full border-2 mr-3 shrink-0 align-middle transition-colors ${
                      selected ? 'border-accent bg-accent' : 'border-muted'
                    }`} />
                    {opt.text}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Result */}
        {rec ? (
          <div className={`card border-2 ${
            rec.color === 'green' ? 'border-green/40 bg-green/5' :
            rec.color === 'yellow' ? 'border-yellow/40 bg-yellow/5' :
            'border-accent/40 bg-accent/5'
          }`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl shrink-0">{rec.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold mb-1 ${
                  rec.color === 'green' ? 'text-green' :
                  rec.color === 'yellow' ? 'text-yellow' : 'text-accent'
                }`}>
                  {fr ? 'Recommandation :' : 'Recommendation:'} {fr ? rec.label.fr : rec.label.en}
                </p>
                <p className="text-xs text-muted leading-relaxed mb-2">{fr ? rec.desc.fr : rec.desc.en}</p>
                <p className={`text-[10px] font-mono px-2 py-1 rounded inline-block ${
                  rec.color === 'green' ? 'bg-green/10 text-green' :
                  rec.color === 'yellow' ? 'bg-yellow/10 text-yellow' :
                  'bg-accent/10 text-accent'
                }`}>
                  {fr ? rec.standard.fr : rec.standard.en}
                </p>
              </div>
            </div>
          </div>
        ) : answeredCount > 0 ? (
          <div className="card border-dashed border-border">
            <p className="text-xs text-muted text-center py-2">
              {fr
                ? `${answeredCount}/4 réponse${answeredCount > 1 ? 's' : ''} — encore ${2 - answeredCount > 0 ? 2 - answeredCount : 0} pour voir la recommandation`
                : `${answeredCount}/4 answer${answeredCount > 1 ? 's' : ''} — ${2 - answeredCount > 0 ? 2 - answeredCount : 0} more to see the recommendation`}
            </p>
          </div>
        ) : null}

        {/* Rationale */}
        <div className="card">
          <label className="label">{t.step0_rationaleLabel}</label>
          <textarea
            value={data.rationale}
            onChange={e => update({ rationale: e.target.value })}
            placeholder={t.step0_rationalePlaceholder}
            rows={3}
            className="input"
          />
        </div>

      </div>
    </ModuleShell>
  )
}
