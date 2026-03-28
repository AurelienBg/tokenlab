import { ModuleKey, ModuleData, ModuleDataMap, HealthScore, M1Data, M3Data, M5Data, M6Data } from './types'
import { MODULE_HEALTH_WEIGHTS } from './constants'

export function computeHealthScore(modules: Partial<Record<ModuleKey, ModuleData>>): HealthScore {
  const breakdown: Partial<Record<ModuleKey, number>> = {}
  const gaps: string[] = []
  let weightedTotal = 0
  let totalWeight = 0

  for (const [key, weight] of Object.entries(MODULE_HEALTH_WEIGHTS) as [ModuleKey, number][]) {
    const mod = modules[key]
    if (!mod) {
      breakdown[key] = 0
      gaps.push(`Module ${key} non renseigné`)
      totalWeight += weight
      continue
    }

    let score = mod.is_complete ? 80 : 40
    score += computeModuleBonus(key, mod.data as ModuleDataMap[typeof key])

    breakdown[key] = Math.min(100, score)
    weightedTotal += breakdown[key]! * weight
    totalWeight += weight
  }

  // Cross-module checks
  const m1 = modules['m1']?.data as M1Data | undefined
  const m3 = modules['m3']?.data as M3Data | undefined
  const m5 = modules['m5']?.data as M5Data | undefined
  const m6 = modules['m6']?.data as M6Data | undefined

  if (m1 && m1.utility_score < 2) {
    gaps.push('Utilité token < 2 principes couverts — risque de token spéculatif')
  }

  if (m3 && m3.emission_revenue_ratio !== null && m3.emission_revenue_ratio > 1) {
    gaps.push('Ratio émission/revenus > 1 — modèle non soutenable')
  }

  if (m5) {
    const total = m5.allocations.reduce((s, a) => s + a.percentage, 0)
    if (Math.abs(total - 100) > 1) {
      gaps.push(`Allocation totale = ${total}% (doit être 100%)`)
    }
    const teamInvestors = m5.allocations
      .filter(a => a.category.toLowerCase().includes('team') || a.category.toLowerCase().includes('invest'))
      .reduce((s, a) => s + a.percentage, 0)
    if (teamInvestors > 50) {
      gaps.push('Team + Investisseurs > 50% — risque de centralisation de gouvernance')
    }
  }

  if (m6 && m6.vesting_schedules.length > 0) {
    const hasShortCliff = m6.vesting_schedules.some(vs => vs.cliff_months < 3 && vs.category.toLowerCase().includes('team'))
    if (hasShortCliff) {
      gaps.push('Cliff équipe < 3 mois — considérer ≥ 6 mois')
    }
  }

  const total = totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 0

  return { total, breakdown, gaps }
}

function computeModuleBonus(key: ModuleKey, data: ModuleDataMap[ModuleKey]): number {
  switch (key) {
    case 'm1': {
      const d = data as M1Data
      return d.utility_score * 5
    }
    case 'm3': {
      const d = data as M3Data
      return (d.faucets.length > 0 ? 10 : 0) + (d.sinks.length > 0 ? 10 : 0)
    }
    case 'm5': {
      const d = data as M5Data
      const total = d.allocations.reduce((s, a) => s + a.percentage, 0)
      return Math.abs(total - 100) < 1 ? 20 : 0
    }
    default:
      return 0
  }
}
