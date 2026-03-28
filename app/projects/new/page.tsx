'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveLocalProject, generateId } from '@/lib/storage'
import { Project, ProjectType, ProjectStage, TokenType } from '@/lib/types'

export default function NewProjectPage() {
  const router = useRouter()
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
    router.push(`/project/${project.id}/dashboard`)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nouveau projet</h1>
        <p className="text-sm text-muted mt-1">
          Renseignez le contexte de votre projet pour personnaliser les recommandations IA.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Informations générales</h2>

          <div>
            <label className="label">Nom du projet *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ex: DeFi Insurance Protocol"
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Description courte</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="En une phrase, quel problème résolvez-vous ?"
              rows={2}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nom du token</label>
              <input
                name="token_name"
                value={form.token_name}
                onChange={handleChange}
                placeholder="ex: Protocol Token"
                className="input"
              />
            </div>
            <div>
              <label className="label">Ticker</label>
              <input
                name="token_ticker"
                value={form.token_ticker}
                onChange={handleChange}
                placeholder="ex: PROT"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Project context */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Contexte projet</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type de projet</label>
              <select name="project_type" value={form.project_type} onChange={handleChange} className="input">
                <option value="">Sélectionner…</option>
                <option value="web3_native">Web3 natif</option>
                <option value="web2_to_web3">Web2 → Web3</option>
                <option value="dao">DAO / Gouvernance</option>
                <option value="rwa">RWA</option>
                <option value="social_impact">Social Impact</option>
              </select>
            </div>
            <div>
              <label className="label">Stade du projet</label>
              <select name="project_stage" value={form.project_stage} onChange={handleChange} className="input">
                <option value="">Sélectionner…</option>
                <option value="ideation">Idéation</option>
                <option value="mvp">MVP</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Blockchain / Écosystème</label>
              <input
                name="blockchain"
                value={form.blockchain}
                onChange={handleChange}
                placeholder="ex: XRPL, Ethereum, Solana"
                className="input"
              />
            </div>
            <div>
              <label className="label">Type de token envisagé</label>
              <select name="token_type" value={form.token_type} onChange={handleChange} className="input">
                <option value="">Sélectionner…</option>
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
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Créer le projet →
          </button>
        </div>
      </form>
    </div>
  )
}
