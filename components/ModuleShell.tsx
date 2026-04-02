'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  overrideNext?: { href: string; label: string }
}

export default function ModuleShell({
  title,
  subtitle,
  projectId,
  moduleKey,
  saved,
  onSave,
  children,
  overrideNext,
}: Props) {
  const { t } = useLang()
  const router = useRouter()
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

  const visibleModules = MODULES.filter((m) => !m.hidden)
  const currentIdx = MODULES.findIndex((m) => m.key === moduleKey)
  const visibleIdx = visibleModules.findIndex((m) => m.key === moduleKey)
  const nextModule = MODULES[currentIdx + 1] ?? null
  const defaultNextHref = nextModule
    ? `/project/${projectId}/${nextModule.path}`
    : `/project/${projectId}/coach`
  const defaultNextLabel = nextModule
    ? t.modules_labels[nextModule.key].shortLabel
    : t.coachIA
  const nextHref = overrideNext?.href ?? defaultNextHref
  const nextLabel = overrideNext?.label ?? defaultNextLabel

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Progress stepper */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-3">
          {visibleModules.map((m, i) => {
            const isComplete = !!(completedBits & (1 << MODULES.indexOf(m)))
            const isCurrent = m.key === moduleKey || (m.key === 'm4' && moduleKey === 'm5')
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
            {(visibleIdx >= 0 ? visibleIdx : visibleModules.findIndex(m => m.key === 'm4')) + 1} / {visibleModules.length}
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
          {/* Save button — changes to green when saved */}
          <button
            onClick={() => onSave(false)}
            title="Cmd+S / Ctrl+S"
            className={`btn text-xs transition-colors ${
              saved
                ? 'btn-ghost text-green border-green/40'
                : 'btn-ghost'
            }`}
          >
            {saved ? t.saved : t.save}
          </button>

          {/* Mark complete — navigates to next module on click */}
          {(() => {
            const isComplete = !!(completedBits & (1 << currentIdx))
            return (
              <button
                onClick={() => {
                  if (!isComplete) {
                    onSave(true)
                    router.push(nextHref)
                  } else {
                    onSave(false)
                  }
                }}
                className={`btn text-xs ${isComplete ? 'btn-ghost text-green border-green/30 hover:text-red hover:border-red/30' : 'btn-primary'}`}
              >
                {isComplete ? `✓ ${t.complete}` : t.markComplete}
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
