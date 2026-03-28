// Tokenlab — TypeScript types

export type ModuleKey = 'step0' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7' | 'm8' | 'm9'
export type MemberRole = 'owner' | 'editor' | 'viewer'
export type ProjectType = 'web3_native' | 'web2_to_web3' | 'dao' | 'rwa' | 'social_impact'
export type ProjectStage = 'ideation' | 'mvp' | 'live'
export type TokenType = 'utility' | 'governance' | 'security' | 'stablecoin' | 'hybrid'

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  owner_id: string
  name: string
  description: string
  token_name: string
  token_ticker: string
  project_type: ProjectType | null
  project_stage: ProjectStage | null
  blockchain: string
  token_type: TokenType | null
  health_score: number
  completed_modules: number
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: MemberRole
  joined_at: string
}

// ─── Module data payloads ─────────────────────────────────────────────────────

export interface Step0Data {
  needs_token: boolean | null
  gate_access: boolean
  absorb_risk: boolean
  capture_value: boolean
  impact_verified: boolean
  rationale: string
  result: 'launch' | 'rethink' | null
}

export interface M1Data {
  token_topology: TokenType | null
  gate_access: boolean
  coordinate_risk: boolean
  incentivize_actions: boolean
  scale_with_usage: boolean
  utility_score: number
  token_standard: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'XLS-20' | 'Custom' | null
  social_impact_primitives: string[]
  notes: string
}

export interface Agent {
  id: string
  name: string
  category: string
  incentive: string
}

export interface Policy {
  id: string
  name: string
  description: string
  type: string
}

export interface M2Data {
  agents: Agent[]
  policies: Policy[]
  notes: string
}

export interface FlowItem {
  id: string
  name: string
  mechanism: string
  estimated_volume: string
}

export interface M3Data {
  faucets: FlowItem[]
  sinks: FlowItem[]
  emission_revenue_ratio: number | null
  notes: string
}

export interface EmissionPhase {
  id: string
  label: string
  duration_months: number
  tokens_per_period: number
  trigger: string
}

export interface M4Data {
  total_supply: number | null
  supply_type: 'fixed' | 'inflationary' | 'deflationary' | 'elastic' | null
  emission_model: 'fixed' | 'decaying' | 'event_based' | 'adaptive' | null
  emission_phases: EmissionPhase[]
  max_inflation_rate: number | null
  notes: string
}

export interface Allocation {
  id: string
  category: string
  percentage: number
  rationale: string
}

export interface M5Data {
  allocations: Allocation[]
  notes: string
}

export interface VestingSchedule {
  id: string
  category: string
  cliff_months: number
  vesting_months: number
  tge_unlock_pct: number
  vesting_type: 'linear' | 'event_driven' | 'specific_date'
}

export interface M6Data {
  vesting_schedules: VestingSchedule[]
  sell_pressure_notes: string
  notes: string
}

export interface M7Data {
  listing_type: 'dex_only' | 'dex_cex' | null
  pool_model: 'cpmm' | 'dlmm' | 'clmm' | null
  liquidity_strategy: 'pol' | 'lp_incentives' | 'skewed' | null
  liquidity_pct: number | null
  cex_tier: 'tier1' | 'tier2' | 'tier3' | 'none' | null
  market_maker: string
  tge_date_target: string
  notes: string
}

export interface M8Data {
  governance_model: 'on_chain' | 'off_chain' | 'hybrid' | 'none' | null
  voting_mechanism: string
  quorum_threshold: number | null
  proposal_threshold: number | null
  timelock_hours: number | null
  rights: string[]
  notes: string
}

export interface M9Data {
  jurisdictions: string[]
  token_classification: 'art' | 'emt' | 'utility' | 'security' | 'unknown' | null
  kyc_required: boolean
  regulatory_counsel: boolean
  compliance_notes: string
  notes: string
}

export type ModuleDataMap = {
  step0: Step0Data
  m1: M1Data
  m2: M2Data
  m3: M3Data
  m4: M4Data
  m5: M5Data
  m6: M6Data
  m7: M7Data
  m8: M8Data
  m9: M9Data
}

export type ModuleDataPayload = ModuleDataMap[ModuleKey]

// ─── Module data row ──────────────────────────────────────────────────────────

export interface ModuleData<K extends ModuleKey = ModuleKey> {
  id: string
  project_id: string
  module_key: K
  data: ModuleDataMap[K]
  ai_feedback: string | null
  is_complete: boolean
  updated_at: string
}

// ─── Health score ─────────────────────────────────────────────────────────────

export interface HealthScore {
  total: number
  breakdown: Partial<Record<ModuleKey, number>>
  gaps: string[]
}

// ─── Local storage schema for anonymous users ─────────────────────────────────

export interface LocalProject {
  project: Project
  modules: Partial<Record<ModuleKey, ModuleData>>
}
