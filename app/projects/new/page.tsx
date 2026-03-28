'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveLocalProject, generateId } from '@/lib/storage'
import { Project, ProjectType, ProjectStage, TokenType } from '@/lib/types'
import { useLang } from '@/components/LangProvider'

export default function NewProjectPage() {
  const router = useRouter()
  const { t } = useLang()
  const [form, setForm] = useState({
    name: '',
    description: '',
    token_name: '',
    token_ticker: '',
    project_type: '' as ProjectType | '',
    project_stage: '' as ProjectStage | '',
    blockchain: '',
    token_type: '' as TokenType | '',
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
      token_name: form.token_name.trim(),
      token_ticker: form.token_ticker.trim().toUpperCase(),
      project_type: (form.project_type || null) as ProjectType | null,
      project_stage: (form.project_stage || null) as ProjectStage | null,
      blockchain: form.blockchain.trim(),
      token_type: (form.token_type || null) as TokenType | null,
      health_score: 0,
      completed_modules: 0,
      created_at: now,
      updated_at: now,
    }

    saveLocalProject(project)
    router.push(`/project/${project.id}/step0`)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.newProjectTitle}</h1>
        <p className="text-sm text-muted mt-1">{t.newProjectSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t.generalInfo}</h2>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t.tokenName}</label>
              <input
                name="token_name"
                value={form.token_name}
                onChange={handleChange}
                placeholder={t.tokenNamePlaceholder}
                className="input"
              />
            </div>
            <div>
              <label className="label">{t.tokenTicker}</label>
              <input
                name="token_ticker"
                value={form.token_ticker}
                onChange={handleChange}
                placeholder={t.tokenTickerPlaceholder}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Project context */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t.projectContext}</h2>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="label">{t.projectStage}</label>
              <select name="project_stage" value={form.project_stage} onChange={handleChange} className="input">
                <option value="">—</option>
                <option value="ideation">Idéation</option>
                <option value="mvp">MVP</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="label">{t.tokenType}</label>
              <select name="token_type" value={form.token_type} onChange={handleChange} className="input">
                <option value="">—</option>
                <option value="utility">Utility</option>
                <option value="governance">Governance</option>
                <option value="security">Security</option>
                <option value="stablecoin">Stablecoin</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
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
