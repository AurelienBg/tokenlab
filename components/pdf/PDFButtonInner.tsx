'use client'

// This file imports @react-pdf/renderer — NEVER SSR'd (loaded via dynamic with ssr:false)
import { PDFDownloadLink } from '@react-pdf/renderer'
import { TokenomicsReport } from './TokenomicsReport'
import type { LocalProject, HealthScore } from '@/lib/types'

interface PDFButtonInnerProps {
  lp: LocalProject
  health: HealthScore
  label: string
}

export default function PDFButtonInner({ lp, health, label }: PDFButtonInnerProps) {
  const fileName = `tokenomics-${lp.project.name.toLowerCase().replace(/\s+/g, '-')}.pdf`

  return (
    <PDFDownloadLink
      document={<TokenomicsReport lp={lp} health={health} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <button className="btn btn-ghost text-xs" disabled={loading}>
          {loading ? '...' : `↓ ${label}`}
        </button>
      )}
    </PDFDownloadLink>
  )
}
