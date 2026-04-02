import { ModuleKey } from './types'

export interface ModuleInfo {
  key: ModuleKey
  label: string
  shortLabel: string
  description: string
  path: string
  optional: boolean
  optionalCondition?: string
}

export const MODULES: ModuleInfo[] = [
  {
    key: 'step0',
    label: 'Token Decision Tree',
    shortLabel: 'Module 0',
    description: 'Avez-vous vraiment besoin d\'un token ?',
    path: 'module/0',
    optional: false,
  },
  {
    key: 'm1',
    label: 'Token Topology & Utility',
    shortLabel: 'Module 1',
    description: 'Type de token, utilité, standard technique',
    path: 'module/1',
    optional: false,
  },
  {
    key: 'm2',
    label: 'Agents & Policies',
    shortLabel: 'Module 2',
    description: 'Qui interagit et selon quelles règles ?',
    path: 'module/2',
    optional: false,
  },
  {
    key: 'm3',
    label: 'Value Flow (Sinks & Faucets)',
    shortLabel: 'Module 3',
    description: 'Sources et destructions de tokens',
    path: 'module/3',
    optional: false,
  },
  {
    key: 'm4',
    label: 'Supply-Side & Emission',
    shortLabel: 'Module 4',
    description: 'Supply totale, modèle d\'émission',
    path: 'module/4',
    optional: false,
  },
  {
    key: 'm5',
    label: 'Distribution & Allocation',
    shortLabel: 'Module 5',
    description: 'Répartition des tokens par catégorie',
    path: 'module/5',
    optional: false,
  },
  {
    key: 'm6',
    label: 'Vesting & Sell Pressure',
    shortLabel: 'Module 6',
    description: 'Calendrier de déblocage, analyse de pression vendeuse',
    path: 'module/6',
    optional: false,
  },
  {
    key: 'm7',
    label: 'TGE & Stratégie de Liquidité',
    shortLabel: 'Module 7',
    description: 'Lancement, pools DEX, market makers',
    path: 'module/7',
    optional: true,
    optionalCondition: 'ideation',
  },
  {
    key: 'm8',
    label: 'Gouvernance',
    shortLabel: 'Module 8',
    description: 'Modèle de gouvernance, droits de vote',
    path: 'module/8',
    optional: true,
    optionalCondition: 'utility_no_vote',
  },
  {
    key: 'm9',
    label: 'Compliance',
    shortLabel: 'Module 9',
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
