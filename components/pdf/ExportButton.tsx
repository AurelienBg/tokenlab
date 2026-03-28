'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { getLocalProject } from '@/lib/storage'
import { computeHealthScore } from '@/lib/healthScore'
import type { LocalProject, HealthScore } from '@/lib/types'

// The PDF stack is never SSR'd — loaded only in browser
const PDFButtonInner = dynamic(() => import('./PDFButtonInner'), { ssr: false })

interface ExportButtonProps {
  projectId: string
  label?: string
}

export function ExportButton({ projectId, label = 'Export PDF' }: ExportButtonProps) {
  const [lp, setLp] = useState<LocalProject | null>(null)
  const [health, setHealth] = useState<HealthScore | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = getLocalProject(projectId)
    if (data) {
      setLp(data)
      setHealth(computeHealthScore(data.modules))
    }
  }, [projectId])

  if (!mounted || !lp || !health) {
    return (
      <button disabled className="btn btn-ghost text-xs opacity-50 cursor-not-allowed">
        ↓ {label}
      </button>
    )
  }

  return <PDFButtonInner lp={lp} health={health} label={label} />
}
