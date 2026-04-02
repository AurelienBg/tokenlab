import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
} from '@react-pdf/renderer'
import { styles, COLORS } from '@/lib/pdfStyles'
import { LocalProject, HealthScore } from '@/lib/types'
import { MODULES } from '@/lib/constants'
import type {
  Step0Data, M1Data, M2Data, M3Data, M4Data,
  M5Data, M6Data, M7Data, M8Data, M9Data,
} from '@/lib/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: string | number | null | undefined, fallback = '—'): string {
  if (v === null || v === undefined || v === '') return fallback
  return String(v)
}

function scoreColor(s: number): string {
  if (s >= 70) return COLORS.green
  if (s >= 40) return COLORS.yellow
  return COLORS.red
}

// ─── Shared layout components ─────────────────────────────────────────────────

function PageHeader({ projectName, ticker }: { projectName: string; ticker?: string }) {
  return (
    <View style={styles.pageHeader} fixed>
      <Text style={styles.pageHeaderTitle}>
        TOKENLAB — {projectName.toUpperCase()}
        {ticker ? ` · $${ticker}` : ''}
      </Text>
      <Text style={styles.pageHeaderRight} render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  )
}

function PageFooter() {
  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.pageFooterText}>Tokenlab — Rapport Tokenomics</Text>
      <Text style={styles.pageFooterText}>tokenlabapp.vercel.app</Text>
    </View>
  )
}

function SectionTitle({ badge, title, description }: { badge: string; title: string; description?: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionBadge}>{badge}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {description && <Text style={styles.sectionDesc}>{description}</Text>}
    </View>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  )
}

function Notes({ text }: { text: string }) {
  if (!text?.trim()) return null
  return <Text style={styles.notes}>📝 {text}</Text>
}

// ─── Cover page ───────────────────────────────────────────────────────────────

function CoverPage({ lp, health }: { lp: LocalProject; health: HealthScore }) {
  const { project } = lp
  const completedCount = MODULES.filter(
    (m) => project.completed_modules & (1 << MODULES.indexOf(m))
  ).length
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Page size="A4" style={styles.coverPage}>
      <View>
        <Text style={styles.coverBadge}>RAPPORT TOKENOMICS</Text>
        <Text style={styles.coverTitle}>{project.name}</Text>
        <Text style={styles.coverSubtitle}>
          {project.description || 'Analyse complète de la structure tokenomique'}
        </Text>
        <View style={styles.coverMeta}>
          {project.token_ticker ? (
            <Text style={styles.coverMetaChip}>${project.token_ticker}</Text>
          ) : null}
          {project.token_name ? (
            <Text style={styles.coverMetaChip}>{project.token_name}</Text>
          ) : null}
          {project.blockchain ? (
            <Text style={styles.coverMetaChip}>{project.blockchain}</Text>
          ) : null}
          {project.token_type ? (
            <Text style={styles.coverMetaChip}>{project.token_type}</Text>
          ) : null}
          {project.project_type ? (
            <Text style={styles.coverMetaChip}>{project.project_type.replace(/_/g, ' ')}</Text>
          ) : null}
          {project.project_stage ? (
            <Text style={styles.coverMetaChip}>{project.project_stage}</Text>
          ) : null}
        </View>
      </View>

      <View>
        <View style={styles.coverScoreBlock}>
          <View style={styles.coverScoreCircle}>
            <Text style={styles.coverScoreNumber}>{health.total}</Text>
          </View>
          <View>
            <Text style={styles.coverScoreLabel}>Health Score / 100</Text>
            <Text style={{ fontSize: 10, color: '#A1A1AA' }}>
              {completedCount} / {MODULES.length} modules complétés
            </Text>
            <Text style={styles.coverDate}>Généré le {date}</Text>
          </View>
        </View>
      </View>
    </Page>
  )
}

// ─── Summary page ─────────────────────────────────────────────────────────────

function SummaryPage({ lp, health }: { lp: LocalProject; health: HealthScore }) {
  const { project } = lp

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />

      {/* Score breakdown */}
      <SectionTitle badge="SYNTHÈSE" title="Score de cohérence" />

      <View style={styles.card}>
        <View style={{ ...styles.row, marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.foreground }}>
            Score global
          </Text>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Helvetica-Bold',
            color: scoreColor(health.total),
          }}>
            {health.total} / 100
          </Text>
        </View>

        {MODULES.map((mod) => {
          const score = health.breakdown[mod.key] ?? 0
          return (
            <View key={mod.key} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{mod.shortLabel} — {mod.label}</Text>
              <View style={styles.breakdownBarOuter}>
                <View style={{
                  ...styles.breakdownBarInner,
                  width: `${score}%`,
                  backgroundColor: scoreColor(score),
                }} />
              </View>
              <Text style={{ ...styles.breakdownScore, color: scoreColor(score) }}>{score}</Text>
            </View>
          )
        })}
      </View>

      {/* Gaps */}
      {health.gaps.length > 0 && (
        <View style={styles.section}>
          <SectionTitle badge="ALERTES" title="Points d'attention" />
          <View style={styles.card}>
            {health.gaps.map((gap, i) => (
              <View key={i} style={styles.gapItem}>
                <Text style={styles.gapDot}>⚠</Text>
                <Text style={styles.gapText}>{gap}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <PageFooter />
    </Page>
  )
}

// ─── Module pages ─────────────────────────────────────────────────────────────

function Step0Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['step0']?.data as Step0Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="ÉTAPE 0"
        title="Token Decision Tree"
        description="Avez-vous vraiment besoin d'un token ?"
      />

      <View style={styles.card}>
        <DataRow label="Décision" value={data.result ? String(data.result) : '—'} />
        <DataRow label="Gate access" value={data.gate_access ? 'Oui' : 'Non'} />
        <DataRow label="Absorb risk" value={data.absorb_risk ? 'Oui' : 'Non'} />
        <DataRow label="Capture value" value={data.capture_value ? 'Oui' : 'Non'} />
        <DataRow label="Impact vérifié" value={data.impact_verified ? 'Oui' : 'Non'} />
      </View>
      {data.rationale && <Notes text={data.rationale} />}
      <PageFooter />
    </Page>
  )
}

function M1Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m1']?.data as M1Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 1"
        title="Token Topology & Utility"
        description="Type de token, utilité, standard technique"
      />

      <View style={styles.card}>
        <DataRow label="Topologie" value={fmt(data.token_topology)} />
        <DataRow label="Standard" value={fmt(data.token_standard)} />
        <DataRow label="Score d'utilité" value={`${data.utility_score} / 4`} />
        <DataRow label="Gate access" value={data.gate_access ? 'Oui' : 'Non'} />
        <DataRow label="Coordinate risk" value={data.coordinate_risk ? 'Oui' : 'Non'} />
        <DataRow label="Incentivize actions" value={data.incentivize_actions ? 'Oui' : 'Non'} />
        <DataRow label="Scale with usage" value={data.scale_with_usage ? 'Oui' : 'Non'} />
      </View>

      {data.social_impact_primitives?.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 9, color: COLORS.muted, marginBottom: 6 }}>Primitives Social Impact :</Text>
          <View style={styles.chipsRow}>
            {data.social_impact_primitives.map((p, i) => (
              <Text key={i} style={{ ...styles.chip, ...styles.chipAccent }}>{p}</Text>
            ))}
          </View>
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M2Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m2']?.data as M2Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 2"
        title="Agents & Policies"
        description="Qui interagit et selon quelles règles ?"
      />

      {/* Agents table */}
      {data.agents.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.foreground }}>
            Agents ({data.agents.length})
          </Text>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>NOM</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>CATÉGORIE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '50%' }}>INCENTIVE</Text>
          </View>
          {data.agents.map((a, i) => (
            <View key={a.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={{ ...styles.tableCell, width: '25%', fontFamily: 'Helvetica-Bold' }}>{a.name}</Text>
              <Text style={{ ...styles.tableCell, width: '25%', color: COLORS.muted }}>{a.category}</Text>
              <Text style={{ ...styles.tableCell, width: '50%' }}>{a.incentive}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Policies table */}
      {data.policies.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.foreground }}>
            Policies ({data.policies.length})
          </Text>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: '25%' }}>NOM</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '20%' }}>TYPE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '55%' }}>DESCRIPTION</Text>
          </View>
          {data.policies.map((p, i) => (
            <View key={p.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={{ ...styles.tableCell, width: '25%', fontFamily: 'Helvetica-Bold' }}>{p.name}</Text>
              <Text style={{ ...styles.tableCell, width: '20%', color: COLORS.muted }}>{p.type}</Text>
              <Text style={{ ...styles.tableCell, width: '55%' }}>{p.description}</Text>
            </View>
          ))}
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M3Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m3']?.data as M3Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 3"
        title="Value Flow — Sinks & Faucets"
        description="Sources de création et de destruction de tokens"
      />

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        {/* Faucets */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.green }}>
            ↑ Faucets ({data.faucets.length})
          </Text>
          {data.faucets.length === 0 && (
            <Text style={{ fontSize: 9, color: COLORS.muted }}>Aucun faucet défini</Text>
          )}
          {data.faucets.map((f, i) => (
            <View key={f.id} style={{ ...styles.card, marginBottom: 6 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{f.name}</Text>
              <Text style={{ fontSize: 8, color: COLORS.muted }}>{f.mechanism}</Text>
              {f.estimated_volume && (
                <Text style={{ fontSize: 8, color: COLORS.accent, marginTop: 3 }}>{f.estimated_volume}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Sinks */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.red }}>
            ↓ Sinks ({data.sinks.length})
          </Text>
          {data.sinks.length === 0 && (
            <Text style={{ fontSize: 9, color: COLORS.muted }}>Aucun sink défini</Text>
          )}
          {data.sinks.map((s, i) => (
            <View key={s.id} style={{ ...styles.card, marginBottom: 6 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{s.name}</Text>
              <Text style={{ fontSize: 8, color: COLORS.muted }}>{s.mechanism}</Text>
              {s.estimated_volume && (
                <Text style={{ fontSize: 8, color: COLORS.accent, marginTop: 3 }}>{s.estimated_volume}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {data.emission_revenue_ratio !== null && (
        <View style={styles.card}>
          <DataRow
            label="Ratio émission/revenus"
            value={`${data.emission_revenue_ratio}${data.emission_revenue_ratio > 1 ? ' ⚠ > 1' : ' ✓'}`}
          />
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M4Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m4']?.data as M4Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 4"
        title="Supply-Side & Emission"
        description="Supply totale, modèle d'émission et phases"
      />

      <View style={styles.card}>
        <DataRow label="Supply totale" value={data.total_supply !== null ? data.total_supply.toLocaleString('fr-FR') : '—'} />
        <DataRow label="Type de supply" value={fmt(data.supply_type)} />
        <DataRow label="Modèle d'émission" value={fmt(data.emission_model)} />
        {data.max_inflation_rate !== null && (
          <DataRow label="Taux d'inflation max" value={`${data.max_inflation_rate}%`} />
        )}
      </View>

      {data.emission_phases.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.foreground }}>
            Phases d'émission ({data.emission_phases.length})
          </Text>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>PHASE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '20%' }}>DURÉE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '30%' }}>TOKENS / PÉRIODE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '20%' }}>DÉCLENCHEUR</Text>
          </View>
          {data.emission_phases.map((phase, i) => (
            <View key={phase.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={{ ...styles.tableCell, width: '30%', fontFamily: 'Helvetica-Bold' }}>{phase.label}</Text>
              <Text style={{ ...styles.tableCell, width: '20%', color: COLORS.muted }}>{phase.duration_months} mois</Text>
              <Text style={{ ...styles.tableCell, width: '30%' }}>{phase.tokens_per_period.toLocaleString('fr-FR')}</Text>
              <Text style={{ ...styles.tableCell, width: '20%', color: COLORS.muted }}>{fmt(phase.trigger)}</Text>
            </View>
          ))}
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M5Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m5']?.data as M5Data | undefined
  if (!data) return null

  const total = data.allocations.reduce((s, a) => s + a.percentage, 0)

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 5"
        title="Distribution & Allocation"
        description="Répartition des tokens par catégorie"
      />

      {data.allocations.length > 0 ? (
        <View>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: '35%' }}>CATÉGORIE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '15%' }}>%</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '50%' }}>JUSTIFICATION</Text>
          </View>
          {data.allocations.map((a, i) => (
            <View key={a.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={{ ...styles.tableCell, width: '35%', fontFamily: 'Helvetica-Bold' }}>{a.category}</Text>
              <View style={{ width: '15%' }}>
                <Text style={{ ...styles.tableCell, fontFamily: 'Helvetica-Bold', color: COLORS.accent }}>{a.percentage}%</Text>
                <View style={styles.progressBarOuter}>
                  <View style={{ ...styles.progressBarInner, width: `${a.percentage}%` }} />
                </View>
              </View>
              <Text style={{ ...styles.tableCell, width: '50%', color: COLORS.muted }}>{fmt(a.rationale)}</Text>
            </View>
          ))}
          <View style={{ ...styles.tableRow, borderBottomWidth: 0 }}>
            <Text style={{ ...styles.tableCell, width: '35%', fontFamily: 'Helvetica-Bold' }}>TOTAL</Text>
            <Text style={{ ...styles.tableCell, width: '15%', fontFamily: 'Helvetica-Bold', color: Math.abs(total - 100) < 1 ? COLORS.green : COLORS.red }}>
              {total}%
            </Text>
            <Text style={{ ...styles.tableCell, width: '50%', color: COLORS.muted }}>
              {Math.abs(total - 100) < 1 ? '✓ Correct' : `⚠ Doit être 100%`}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={{ fontSize: 9, color: COLORS.muted }}>Aucune allocation définie</Text>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M6Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m6']?.data as M6Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 6"
        title="Vesting & Sell Pressure"
        description="Calendrier de déblocage par catégorie"
      />

      {data.vesting_schedules.length > 0 ? (
        <View style={{ marginBottom: 14 }}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: '28%' }}>CATÉGORIE</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '18%' }}>CLIFF</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '18%' }}>VESTING</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '18%' }}>TGE %</Text>
            <Text style={{ ...styles.tableHeaderCell, width: '18%' }}>TYPE</Text>
          </View>
          {data.vesting_schedules.map((vs, i) => (
            <View key={vs.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={{ ...styles.tableCell, width: '28%', fontFamily: 'Helvetica-Bold' }}>{vs.category}</Text>
              <Text style={{ ...styles.tableCell, width: '18%', color: vs.cliff_months < 3 ? COLORS.red : COLORS.muted }}>
                {vs.cliff_months} mois{vs.cliff_months < 3 ? ' ⚠' : ''}
              </Text>
              <Text style={{ ...styles.tableCell, width: '18%', color: COLORS.muted }}>{vs.vesting_months} mois</Text>
              <Text style={{ ...styles.tableCell, width: '18%', color: COLORS.accent }}>{vs.tge_unlock_pct}%</Text>
              <Text style={{ ...styles.tableCell, width: '18%', color: COLORS.muted }}>{vs.vesting_type}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 9, color: COLORS.muted, marginBottom: 10 }}>Aucun calendrier défini</Text>
      )}

      {data.sell_pressure_notes && (
        <View style={styles.card}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Analyse de pression vendeuse</Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>{data.sell_pressure_notes}</Text>
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M7Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m7']?.data as M7Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 7"
        title="TGE & Stratégie de Liquidité"
        description="Lancement, pools DEX, market makers"
      />

      <View style={styles.card}>
        <DataRow label="Type de listing" value={fmt(data.listing_type)} />
        <DataRow label="Modèle de pool" value={fmt(data.pool_model)} />
        <DataRow label="Stratégie liquidité" value={fmt(data.liquidity_strategy)} />
        {data.liquidity_pct !== null && (
          <DataRow label="% supply en liquidité" value={`${data.liquidity_pct}%`} />
        )}
        {data.cex_tier && (
          <DataRow label="Tier CEX" value={data.cex_tier} />
        )}
        {data.market_maker && (
          <DataRow label="Market maker" value={data.market_maker} />
        )}
        {data.tge_date_target && (
          <DataRow label="Date TGE cible" value={data.tge_date_target} />
        )}
      </View>

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M8Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m8']?.data as M8Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 8"
        title="Gouvernance"
        description="Modèle de gouvernance et droits de vote"
      />

      <View style={styles.card}>
        <DataRow label="Modèle" value={fmt(data.governance_model)} />
        <DataRow label="Mécanisme de vote" value={fmt(data.voting_mechanism)} />
        {data.quorum_threshold !== null && (
          <DataRow label="Quorum" value={`${data.quorum_threshold}%`} />
        )}
        {data.proposal_threshold !== null && (
          <DataRow label="Seuil de proposition" value={`${data.proposal_threshold} tokens`} />
        )}
        {data.timelock_hours !== null && (
          <DataRow label="Timelock" value={`${data.timelock_hours}h`} />
        )}
      </View>

      {data.rights.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 9, color: COLORS.muted, marginBottom: 6 }}>Droits gouvernés :</Text>
          <View style={styles.chipsRow}>
            {data.rights.map((r, i) => (
              <Text key={i} style={{ ...styles.chip, ...styles.chipAccent }}>{r}</Text>
            ))}
          </View>
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

function M9Page({ lp }: { lp: LocalProject }) {
  const { project } = lp
  const data = lp.modules['m9']?.data as M9Data | undefined
  if (!data) return null

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader projectName={project.name} ticker={project.token_ticker} />
      <SectionTitle
        badge="MODULE 9"
        title="Compliance"
        description="MiCA, SEC, VARA — Réglementation applicable"
      />

      <View style={styles.card}>
        <DataRow label="Classification" value={fmt(data.token_classification)} />
        <DataRow label="KYC requis" value={data.kyc_required ? 'Oui' : 'Non'} />
        <DataRow label="Conseil juridique" value={data.regulatory_counsel ? 'Oui — consulté' : 'Non'} />
      </View>

      {data.jurisdictions.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 9, color: COLORS.muted, marginBottom: 6 }}>Juridictions concernées :</Text>
          <View style={styles.chipsRow}>
            {data.jurisdictions.map((j, i) => (
              <Text key={i} style={{ ...styles.chip, ...styles.chipMuted }}>{j}</Text>
            ))}
          </View>
        </View>
      )}

      {data.compliance_notes && (
        <View style={{ ...styles.card, marginBottom: 10 }}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Notes compliance</Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>{data.compliance_notes}</Text>
        </View>
      )}

      <Notes text={data.notes} />
      <PageFooter />
    </Page>
  )
}

// ─── Main document ─────────────────────────────────────────────────────────────

export function TokenomicsReport({ lp, health }: { lp: LocalProject; health: HealthScore }) {
  return (
    <Document
      title={`Tokenomics — ${lp.project.name}`}
      author="Tokenlab"
      subject="Rapport tokenomics"
    >
      <CoverPage lp={lp} health={health} />
      <SummaryPage lp={lp} health={health} />
      {lp.modules['step0'] && <Step0Page lp={lp} />}
      {lp.modules['m1'] && <M1Page lp={lp} />}
      {lp.modules['m2'] && <M2Page lp={lp} />}
      {lp.modules['m3'] && <M3Page lp={lp} />}
      {lp.modules['m4'] && <M4Page lp={lp} />}
      {lp.modules['m5'] && <M5Page lp={lp} />}
      {lp.modules['m6'] && <M6Page lp={lp} />}
      {lp.modules['m7'] && <M7Page lp={lp} />}
      {lp.modules['m8'] && <M8Page lp={lp} />}
      {lp.modules['m9'] && <M9Page lp={lp} />}
    </Document>
  )
}
