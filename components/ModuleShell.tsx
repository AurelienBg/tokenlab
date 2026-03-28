'use client'

import Link from 'next/link'
import { ModuleKey } from '@/lib/types'

interface Props {
  title: string
  subtitle?: string
  projectId: string
  moduleKey: ModuleKey
  saved: boolean
  onSave: (isComplete: boolean) => void
  children: React.ReactNode
}

export default function ModuleShell({
  title,
  subtitle,
  projectId,
  saved,
  onSave,
  children,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Save actions */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
        <Link
          href={`/project/${projectId}/dashboard`}
          className="btn btn-ghost"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green">✓ Sauvegardé</span>
          )}
          <button
            onClick={() => onSave(false)}
            className="btn btn-ghost"
          >
            Sauvegarder
          </button>
          <button
            onClick={() => onSave(true)}
            className="btn btn-primary"
          >
            Marquer comme complet ✓
          </button>
        </div>
      </div>
    </div>
  )
}
