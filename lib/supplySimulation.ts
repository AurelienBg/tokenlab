import { M4Data, M5Data, M6Data } from './types'

export interface SimulationPoint {
  month: number
  total: number // cumulative circulating supply
  byCategory: Record<string, number>
}

export interface CategorySim {
  category: string
  color: string
  tokens: number
  tge_pct: number
  cliff: number
  vesting: number
}

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export function computeSupplySimulation(
  m4: M4Data | null,
  m5: M5Data | null,
  m6: M6Data | null,
  horizonMonths = 48
): { points: SimulationPoint[]; categories: CategorySim[]; totalSupply: number } {
  const totalSupply = m4?.total_supply ?? 0
  const allocations = m5?.allocations ?? []
  const schedules = m6?.vesting_schedules ?? []

  if (!totalSupply || allocations.length === 0) {
    return { points: [], categories: [], totalSupply }
  }

  const categories: CategorySim[] = allocations.map((a, i) => {
    // Match vesting schedule by category name (case-insensitive, partial)
    const sched = schedules.find((s) =>
      s.category.toLowerCase().includes(a.category.toLowerCase()) ||
      a.category.toLowerCase().includes(s.category.toLowerCase())
    )
    return {
      category: a.category,
      color: COLORS[i % COLORS.length],
      tokens: totalSupply * (a.percentage / 100),
      tge_pct: sched?.tge_unlock_pct ?? 0,
      cliff: sched?.cliff_months ?? 0,
      vesting: sched?.vesting_months ?? 0,
    }
  })

  const points: SimulationPoint[] = []

  for (let month = 0; month <= horizonMonths; month++) {
    const byCategory: Record<string, number> = {}
    let total = 0

    for (const cat of categories) {
      const tgeUnlocked = cat.tokens * (cat.tge_pct / 100)
      const remaining = cat.tokens - tgeUnlocked

      let unlocked: number
      if (cat.vesting === 0) {
        // No vesting: all at TGE
        unlocked = cat.tokens
      } else if (month === 0) {
        unlocked = tgeUnlocked
      } else if (month <= cat.cliff) {
        unlocked = tgeUnlocked
      } else {
        const monthsVested = Math.min(month - cat.cliff, cat.vesting)
        unlocked = tgeUnlocked + remaining * (monthsVested / cat.vesting)
      }

      byCategory[cat.category] = unlocked
      total += unlocked
    }

    points.push({ month, total, byCategory })
  }

  return { points, categories, totalSupply }
}

export function formatSupply(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return Math.round(n).toString()
}
