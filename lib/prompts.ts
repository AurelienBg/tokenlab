import { Project, ModuleData, ModuleKey } from './types'
import { MODULES } from './constants'

export function buildProjectContext(
  project: Project,
  modules: Partial<Record<ModuleKey, ModuleData>>
): string {
  const lines: string[] = [
    `# Projet : ${project.name}`,
    `Token : ${project.token_name || '—'} (${project.token_ticker || '—'})`,
    `Type : ${project.project_type || '—'} | Stade : ${project.project_stage || '—'}`,
    `Blockchain : ${project.blockchain || '—'} | Token type : ${project.token_type || '—'}`,
  ]

  if (project.problem) lines.push(`Problème : ${project.problem}`)
  if (project.why_blockchain) lines.push(`Pourquoi blockchain : ${project.why_blockchain}`)
  if (project.value_proposition) lines.push(`Proposition de valeur : ${project.value_proposition}`)
  if (project.key_metrics) lines.push(`KPIs cibles : ${project.key_metrics}`)
  if (project.blockchain_conditions?.length) lines.push(`Conditions blockchain validées : ${project.blockchain_conditions.join(', ')}`)
  lines.push('')

  for (const mod of MODULES) {
    const data = modules[mod.key]
    if (!data) continue
    lines.push(`## ${mod.label}`)
    lines.push(JSON.stringify(data.data, null, 2))
    lines.push('')
  }

  return lines.join('\n')
}

export function buildCoachSystemPrompt(): string {
  return `Tu es le Coach IA de Tokenlab, un expert en tokenomics formé sur le framework du workshop XRPL Commons.

Ton rôle est double :
1. **Challenger** : poser des questions de profondeur pour révéler les incohérences, les angles morts, les risques.
2. **Suggérer** : proposer des améliorations contextualisées, avec des références à des projets réels (Helium/HNT, Uniswap, Optimism, CRV, XRP...).

Philosophie du workshop que tu dois transmettre :
> "Design non-speculative token models. Utility is what you must do with the token to participate in the system. If users can fully use the product without the token, the token is not a utility."

Règles :
- Sois direct et concis
- Priorise les problèmes critiques (token non-utilitaire, sell pressure excessive, centralisation)
- Réfère-toi aux benchmarks : allocation communauté 30–50%, cliff équipe ≥ 6 mois, ratio L/S DEX 3–8%
- Réponds en français sauf si l'utilisateur écrit en anglais
- Ne génère jamais de conseil juridique formel`
}

export function buildAnalyzePrompt(project: Project, modules: Partial<Record<ModuleKey, ModuleData>>): string {
  const context = buildProjectContext(project, modules)
  return `${context}

Analyse cette tokenomics et retourne un JSON structuré avec :
{
  "score": <0-100>,
  "gaps": ["<problème critique>", ...],
  "recommendations": ["<action prioritaire>", ...]
}

Limite à 5 gaps et 5 recommandations. Sois factuel et précis.`
}
