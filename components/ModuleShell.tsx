'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ModuleKey } from '@/lib/types'
import { useLang } from './LangProvider'
import { MODULES } from '@/lib/constants'
import { getLocalProject } from '@/lib/storage'

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
  moduleKey,
  saved,
  onSave,
  children,
}: Props) {
  const { t } = useLang()
  const [completedBits, setCompletedBits] = useState(0)

  // Load + refresh completion status
  useEffect(() => {
    const lp = getLocalProject(projectId)
    if (lp) setCompletedBits(lp.project.completed_modules)

    function onSaved() {
      const updated = getLocalProject(projectId)
      if (updated) setCompletedBits(updated.project.completed_modules)
    }
    window.addEventListener('tokenlab:module-saved', onSaved)
    return () => window.removeEventListener('tokenlab:module-saved', onSaved)
  }, [projectId])

  const currentIdx = MODULES.findIndex((m) => m.key === moduleKey)
  const nextModule = MODULES[currentIdx + 1] ?? null
  const nextHref = nextModule
    ? `/project/${projectId}/${nextModule.path}`
    : `/project/${projectId}/coach`
  const nextLabel = nextModule
    ? t.modules_labels[nextModule.key].shortLabel
    : t.coachIA

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Progress stepper */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-3">
          {MODULES.map((m, i) => {
            const isComplete = !!(completedBits & (1 << i))
            const isCurrent = m.key === moduleKey
            return (
              <Link
                key={m.key}
                href={`/project/${projectId}/${m.path}`}
                title={t.modules_labels[m.key].label}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-accent'
                    : isComplete
                    ? 'bg-green/60'
                    : 'bg-border hover:bg-muted/40'
                }`}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
          </div>
          <span className="text-xs text-muted font-mono shrink-0">
            {currentIdx + 1} / {MODULES.length}
          </span>
        </div>
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
          {t.backDashboard}
        </Link>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green animate-fade-in">{t.saved}</span>
          )}
          <button
            onClick={() => onSave(false)}
            className="btn btn-ghost text-xs"
            title="Cmd+S / Ctrl+S"
          >
            {t.save}
          </button>
          {(() => {
            const isComplete = !!(completedBits & (1 << currentIdx))
            return (
              <button
                onClick={() => onSave(!isComplete)}
                className={`btn text-xs group/complete ${isComplete ? 'btn-ghost text-green border-green/30 hover:text-red hover:border-red/30' : 'btn-primary'}`}
              >
                {isComplete ? (
                  <>
                    <span className="group-hover/complete:hidden">✓ {t.complete}</span>
                    <span className="hidden group-hover/complete:inline">{t.markIncomplete}</span>
                  </>
                ) : t.markComplete}
              </button>
            )
          })()}
          <Link
            href={nextHref}
            className="btn btn-ghost text-xs flex items-center gap-1"
          >
            {nextLabel} →
          </Link>
        </div>
      </div>
    </div>
  )
}
