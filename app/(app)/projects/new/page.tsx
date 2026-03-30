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

export default function NewProjectPage() {
  const router = useRouter()
  const { t, lang } = useLang()
  const [form, setForm] = useState({
    name: '',
    description: '',
    project_type: '' as ProjectType | '',
    project_stage: '' as ProjectStage | '',
    blockchain: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
    }

    saveLocalProject(project)
    router.push(`/project/${project.id}/step0`)
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.newProjectTitle}</h1>
        <p className="text-sm text-muted mt-1">{t.newProjectSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom */}
        <div>
          <label className="label">{t.projectName}</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t.projectNamePlaceholder}
            required
            autoFocus
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">{t.description}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={t.descriptionPlaceholder}
            rows={2}
            className="input"
          />
        </div>

        {/* Type de projet */}
        <div>
          <label className="label">{t.projectType}</label>
          <select name="project_type" value={form.project_type} onChange={handleChange} className="input">
            <option value="">—</option>
            <option value="web3_native">Web3 natif</option>
            <option value="web2_to_web3">Web2 → Web3</option>
            <option value="dao">DAO / Gouvernance</option>
            <option value="rwa">RWA</option>
            <option value="social_impact">Social Impact</option>
          </select>
        </div>

        {/* Stade — boutons */}
        <div>
          <label className="label">{t.projectStage}</label>
          <div className="flex gap-2">
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, project_stage: s.value }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.project_stage === s.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-muted border-border hover:border-accent/50 hover:text-foreground'
                }`}
              >
                {lang === 'fr' ? s.labelFr : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Blockchain */}
        <div>
          <label className="label">{t.blockchain}</label>
          <input
            name="blockchain"
            value={form.blockchain}
            onChange={handleChange}
            placeholder={t.blockchainPlaceholder}
            className="input"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
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
