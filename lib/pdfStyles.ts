import { StyleSheet } from '@react-pdf/renderer'

// Hardcoded light-theme values — PDF is always "printed"
export const COLORS = {
  accent: '#7C3AED',
  accentLight: '#EDE9FE',
  foreground: '#0A0A0F',
  muted: '#64748B',
  border: '#E2E8F0',
  surface: '#F8FAFC',
  green: '#16A34A',
  yellow: '#CA8A04',
  red: '#DC2626',
  white: '#FFFFFF',
}

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.white,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    color: COLORS.foreground,
  },

  // ── Cover ─────────────────────────────────────────────────────────────────

  coverPage: {
    fontFamily: 'Helvetica',
    backgroundColor: COLORS.foreground,
    color: COLORS.white,
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 56,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverBadge: {
    backgroundColor: COLORS.accent,
    color: COLORS.white,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 32,
  },
  coverMeta: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 48,
  },
  coverMetaChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 10,
    color: '#E4E4E7',
  },
  coverScoreBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  coverScoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverScoreNumber: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  coverScoreLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 9,
    color: '#71717A',
    marginTop: 4,
  },

  // ── Page header / footer ──────────────────────────────────────────────────

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
  },
  pageHeaderTitle: {
    fontSize: 9,
    color: COLORS.muted,
    letterSpacing: 0.5,
    fontFamily: 'Helvetica-Bold',
  },
  pageHeaderRight: {
    fontSize: 9,
    color: COLORS.muted,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  pageFooterText: {
    fontSize: 8,
    color: COLORS.muted,
  },

  // ── Section ───────────────────────────────────────────────────────────────

  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionBadge: {
    backgroundColor: COLORS.accentLight,
    color: COLORS.accent,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.foreground,
  },
  sectionDesc: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
    marginBottom: 10,
  },

  // ── Cards & tables ────────────────────────────────────────────────────────

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 9,
    color: COLORS.muted,
    width: '35%',
  },
  rowValue: {
    fontSize: 9,
    color: COLORS.foreground,
    width: '63%',
    fontFamily: 'Helvetica-Bold',
  },

  // ── Tables ────────────────────────────────────────────────────────────────

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.foreground,
  },

  // ── Misc ──────────────────────────────────────────────────────────────────

  chip: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  chipAccent: {
    backgroundColor: COLORS.accentLight,
    color: COLORS.accent,
  },
  chipMuted: {
    backgroundColor: COLORS.surface,
    color: COLORS.muted,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  notes: {
    fontSize: 9,
    color: COLORS.muted,
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopStyle: 'solid',
  },
  gapItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  gapDot: {
    fontSize: 9,
    color: COLORS.yellow,
    marginTop: 1,
  },
  gapText: {
    fontSize: 9,
    color: COLORS.foreground,
    flex: 1,
  },

  // ── Progress bar ──────────────────────────────────────────────────────────

  progressBarOuter: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarInner: {
    height: 6,
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },

  // ── Score breakdown ───────────────────────────────────────────────────────

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  breakdownLabel: {
    fontSize: 9,
    color: COLORS.muted,
    width: 140,
  },
  breakdownBarOuter: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownBarInner: {
    height: 5,
    borderRadius: 3,
  },
  breakdownScore: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    width: 32,
    textAlign: 'right',
  },
})
