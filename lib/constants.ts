import { ModuleKey } from './types'

export interface ModuleInfo {
  key: ModuleKey
  label: string
  shortLabel: string
  description: string
  path: string
  optional: boolean
  optionalCondition?: string
  hidden?: boolean  // hidden from nav + progress bar (tab inside another step)
}

export const MODULES: ModuleInfo[] = [
  {
    key: 'step0',
    label: 'Token Decision Tree',
    shortLabel: 'Étape 1',
    description: 'Avez-vous vraiment besoin d\'un token ?',
    path: 'module/0',
    optional: false,
  },
  {
    key: 'm1',
    label: 'Token Topology & Utility',
    shortLabel: 'Étape 2',
    description: 'Type de token, utilité, standard technique',
    path: 'module/1',
    optional: false,
  },
  {
    key: 'm2',
    label: 'Agents & Policies',
    shortLabel: 'Étape 3',
    description: 'Qui interagit et selon quelles règles ?',
    path: 'module/2',
    optional: false,
  },
  {
    key: 'm3',
    label: 'Value Flow (Sinks & Faucets)',
    shortLabel: 'Étape 4',
    description: 'Sources et destructions de tokens',
    path: 'module/3',
    optional: false,
  },
  {
    key: 'm4',
    label: 'Supply, Allocation & Simulation',
    shortLabel: 'Étape 5',
    description: 'Supply totale, allocation, simulation',
    path: 'module/4',
    optional: false,
  },
  {
    key: 'm5',
    label: 'Distribution & Allocation',
    shortLabel: 'Allocation',
    description: 'Allocation des tokens par catégorie',
    path: 'module/5',
    optional: false,
    hidden: true,
  },
  {
    key: 'm6',
    label: 'Vesting & Sell Pressure',
    shortLabel: 'Étape 6',
    description: 'Calendrier de déblocage, analyse de pression vendeuse',
    path: 'module/6',
    optional: false,
  },
  {
    key: 'm7',
    label: 'TGE & Liquidity Strategy',
    shortLabel: 'Étape 7',
    description: 'Lancement, pools DEX, market makers',
    path: 'module/7',
    optional: true,
    optionalCondition: 'ideation',
  },
  {
    key: 'm8',
    label: 'Governance',
    shortLabel: 'Étape 8',
    description: 'Modèle de gouvernance, droits de vote',
    path: 'module/8',
    optional: true,
    optionalCondition: 'utility_no_vote',
  },
  {
    key: 'm9',
    label: 'Compliance',
    shortLabel: 'Étape 9',
    description: 'MiCA, SEC, VARA — réglementation',
    path: 'module/9',
    optional: true,
    optionalCondition: 'ideation',
  },
]

export const MODULE_BITS: Record<ModuleKey, number> = {
  step0: 1 << 0,
  m1: 1 << 1,
  m2: 1 << 2,
  m3: 1 << 3,
  m4: 1 << 4,
  m5: 1 << 5,
  m6: 1 << 6,
  m7: 1 << 7,
  m8: 1 << 8,
  m9: 1 << 9,
}

export const MODULE_HEALTH_WEIGHTS: Record<ModuleKey, number> = {
  step0: 5,
  m1: 15,
  m2: 10,
  m3: 15,
  m4: 10,
  m5: 15,
  m6: 15,
  m7: 5,
  m8: 5,
  m9: 5,
}

export const ALLOCATION_BENCHMARKS = [
  { category: 'Team & Advisors', min: 10, max: 20, vestingStandard: '≥ 12–24m vesting, 6m cliff' },
  { category: 'Investors', min: 15, max: 25, vestingStandard: '≥ 3–24m vesting, 3–6m cliff' },
  { category: 'Community & Ecosystem', min: 30, max: 50, vestingStandard: 'Custom vesting' },
  { category: 'Treasury & Reserves', min: 10, max: 25, vestingStandard: '> 24m vesting, 6m cliff' },
  { category: 'Liquidity', min: 5, max: 15, vestingStandard: '—' },
]
