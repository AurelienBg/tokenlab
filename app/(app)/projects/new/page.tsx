'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveLocalProject, generateId } from '@/lib/storage'
import { Project, ProjectType, ProjectStage } from '@/lib/types'
import { useLang } from '@/components/LangProvider'

const STAGES: { value: ProjectStage; labelFr: string; labelEn: string }[] = [
  { value: 'ideation', labelFr: 'Idéation', labelEn: 'Ideation' },
  { value: 'mvp',      labelFr: 'MVP',       labelEn: 'MVP'      },
  { value: 'live',     labelFr: 'Live',      labelEn: 'Live'     },
]

const BLOCKCHAIN_CONDITIONS: { id: string; fr: string; en: string }[] = [
  { id: 'stakeholders',  fr: 'Plusieurs parties prenantes sont impliquées',       en: 'Multiple stakeholders are involved' },
  { id: 'limited_trust', fr: 'La confiance entre les parties est limitée',         en: 'Trust is limited among parties involved' },
  { id: 'incentives',    fr: 'Il existe des incitations claires à collaborer',     en: 'There are clear incentives on working together' },
  { id: 'conflicting',   fr: 'Les parties ont des intérêts divergents',            en: 'Stakeholders have conflicting interests' },
  { id: 'shared_data',   fr: 'Les données sont partagées entre les parties',       en: 'Data is shared across parties' },
  { id: 'transparency',  fr: 'La transparence sur les données partagées est limitée', en: 'There is limited transparency of shared data' },
  { id: 'inefficient',   fr: 'Les processus actuels sont inefficaces et lents',   en: 'Current processes are inefficient, obsolete and slow' },
  { id: 'immutable',     fr: 'Les données doivent être immuables',                 en: 'Data needs to be immutable' },
  { id: 'audits',        fr: 'Des audits tiers sont nécessaires',                  en: 'Third party audits are required' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const { t, lang } = useLang()
  const fr = lang === 'fr'

  const [form, setForm] = useState({
    name: '',
    description: '',
    project_type: '' as ProjectType | '',
    project_stage: '' as ProjectStage | '',
    blockchain: '',
    problem: '',
    why_blockchain: '',
    value_proposition: '',
    key_metrics: '',
    blockchain_conditions: [] as string[],
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function toggleCondition(id: string) {
    setForm(prev => ({
      ...prev,
      blockchain_conditions: prev.blockchain_conditions.includes(id)
        ? prev.blockchain_conditions.filter(c => c !== id)
        : [...prev.blockchain_conditions, id],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    const now = new Date().toISOString()
    const project: Project = {
      id: generateId(),
      owner_id: 'local',
      name: form.name.trim(),
      description: form.description.trim(),
      token_name: '',
      token_ticker: '',
      project_type: (form.project_type || null) as ProjectType | null,
      project_stage: (form.project_stage || null) as ProjectStage | null,
      blockchain: form.blockchain.trim(),
      token_type: null,
      health_score: 0,
      completed_modules: 0,
      created_at: now,
      updated_at: now,
      problem: form.problem.trim() || undefined,
      why_blockchain: form.why_blockchain.trim() || undefined,
      value_proposition: form.value_proposition.trim() || undefined,
      key_metrics: form.key_metrics.trim() || undefined,
      blockchain_conditions: form.blockchain_conditions.length > 0 ? form.blockchain_conditions : undefined,
    }

    saveLocalProject(project)
    router.push(`/project/${project.id}/module/0`)
  }

  const conditionCount = form.blockchain_conditions.length

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.newProjectTitle}</h1>
        <p className="text-sm text-muted mt-1">{t.newProjectSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Section 1: Basics ── */}
        <div>
          <label className="label">{t.projectName}</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder={t.projectNamePlaceholder} required autoFocus className="input" />
        </div>

        <div>
          <label className="label">{t.description}</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder={t.descriptionPlaceholder} rows={2} className="input" />
        </div>

        <div>
          <label className="label">{t.projectType}</label>
          <select name="project_type" value={form.project_type} onChange={handleChange} className="input">
            <option value="">—</option>
            <option value="web3_native">{fr ? 'Web3 natif' : 'Web3 native'}</option>
            <option value="web2_to_web3">Web2 → Web3</option>
            <option value="dao">{fr ? 'DAO / Gouvernance' : 'DAO / Governance'}</option>
            <option value="rwa">RWA</option>
            <option value="social_impact">Social Impact</option>
          </select>
        </div>

        <div>
          <label className="label">{t.projectStage}</label>
          <div className="flex gap-2">
            {STAGES.map(s => (
              <button key={s.value} type="button"
                onClick={() => setForm(f => ({ ...f, project_stage: s.value }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.project_stage === s.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-muted border-border hover:border-accent/50 hover:text-foreground'
                }`}>
                {fr ? s.labelFr : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">{t.blockchain}</label>
          <input name="blockchain" value={form.blockchain} onChange={handleChange}
            placeholder={t.blockchainPlaceholder} className="input" />
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted uppercase tracking-widest">{t.npContextSection}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-xs text-muted -mt-3">{t.npContextDesc}</p>

        {/* ── Section 2: Business context ── */}
        <div>
          <label className="label">{t.npProblem}</label>
          <textarea name="problem" value={form.problem} onChange={handleChange}
            placeholder={t.npProblemPlaceholder} rows={2} className="input" />
        </div>

        <div>
          <label className="label">{t.npWhyBlockchain}</label>
          <textarea name="why_blockchain" value={form.why_blockchain} onChange={handleChange}
            placeholder={t.npWhyBlockchainPlaceholder} rows={2} className="input" />
        </div>

        <div>
          <label className="label">{t.npValueProp}</label>
          <textarea name="value_proposition" value={form.value_proposition} onChange={handleChange}
            placeholder={t.npValuePropPlaceholder} rows={2} className="input" />
        </div>

        <div>
          <label className="label">{t.npKeyMetrics}</label>
          <input name="key_metrics" value={form.key_metrics} onChange={handleChange}
            placeholder={t.npKeyMetricsPlaceholder} className="input" />
        </div>

        {/* ── Blockchain conditions checklist ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="label mb-0">{t.npBlockchainConditions}</span>
            {conditionCount > 0 && (
              <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium">
                {conditionCount}/9
              </span>
            )}
          </div>
          <div className="space-y-2 mt-1">
            {BLOCKCHAIN_CONDITIONS.map(c => {
              const checked = form.blockchain_conditions.includes(c.id)
              return (
                <button key={c.id} type="button" onClick={() => toggleCondition(c.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    checked
                      ? 'border-accent/40 bg-accent/8 text-foreground'
                      : 'border-border text-muted hover:border-accent/30 hover:text-foreground'
                  }`}>
                  <span className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors ${
                    checked ? 'border-accent bg-accent' : 'border-muted'
                  }`}>
                    {checked && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {fr ? c.fr : c.en}
                </button>
              )
            })}
          </div>
          {conditionCount >= 5 && (
            <p className="text-xs text-green mt-2 flex items-center gap-1">
              <span>✓</span>
              {fr
                ? `${conditionCount} conditions validées — blockchain justifiée pour ce projet.`
                : `${conditionCount} conditions validated — blockchain is justified for this project.`}
            </p>
          )}
          {conditionCount > 0 && conditionCount < 5 && (
            <p className="text-xs text-yellow mt-2 flex items-center gap-1">
              <span>⚠</span>
              {fr
                ? `Seulement ${conditionCount} condition${conditionCount > 1 ? 's' : ''} — réfléchissez si une DB classique ne suffirait pas.`
                : `Only ${conditionCount} condition${conditionCount > 1 ? 's' : ''} — consider whether a traditional database might suffice.`}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button type="button" onClick={() => router.push('/projects')} className="btn btn-ghost">
            {t.cancel}
          </button>
          <button type="submit" className="btn btn-primary" disabled={!form.name.trim()}>
            {t.create}
          </button>
        </div>
      </form>
    </div>
  )
}
