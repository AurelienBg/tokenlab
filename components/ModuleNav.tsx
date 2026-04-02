'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MODULES } from '@/lib/constants'
import { Project } from '@/lib/types'
import { useLang } from './LangProvider'

interface Props {
  project: Project
}

export default function ModuleNav({ project }: Props) {
  const pathname = usePathname()
  const base = `/project/${project.id}`
  const { t } = useLang()

  const isDashboard = pathname === `${base}/dashboard`
  const isCoach = pathname.startsWith(`${base}/coach`)

  return (
    <nav className="space-y-1">
      {/* Dashboard — section header style */}
      <Link
        href={`${base}/dashboard`}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
          isDashboard
            ? 'text-accent bg-accent/10'
            : 'text-foreground hover:bg-surface-hover'
        }`}
      >
        <span className="text-xs opacity-60">◈</span>
        {t.dashboard}
      </Link>

      {/* Divider + étapes label */}
      <div className="pt-1 pb-0.5 px-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted uppercase tracking-wider">Étapes</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* Étapes */}
      {MODULES.map((m) => {
        const ml = t.modules_labels[m.key]
        const href = `${base}/${m.path}`
        const isActive = pathname.startsWith(href)
        const isComplete = !!(project.completed_modules & (1 << MODULES.indexOf(m)))
        return (
          <Link
            key={m.key}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            {isComplete ? (
              <span className="w-4 h-4 rounded-full bg-green/20 flex items-center justify-center shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3.5" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            ) : (
              <span className="text-xs w-4 text-center shrink-0 opacity-50">{moduleIcon(m.key)}</span>
            )}
            <span className="flex flex-col flex-1 min-w-0">
              <span className={`text-xs font-medium ${isComplete ? 'text-foreground' : ''}`}>{ml.shortLabel}</span>
              <span className="text-[10px] opacity-60 truncate">{ml.label}</span>
            </span>
          </Link>
        )
      })}

      {/* Divider + Coach IA */}
      <div className="pt-1 pb-0.5 px-3">
        <div className="h-px bg-border" />
      </div>

      <Link
        href={`${base}/coach`}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
          isCoach
            ? 'text-accent bg-accent/10'
            : 'text-foreground hover:bg-surface-hover'
        }`}
      >
        <span className="text-xs opacity-60">✦</span>
        {t.coachIA}
      </Link>
    </nav>
  )
}

function moduleIcon(key: string): string {
  const icons: Record<string, string> = {
    step0: '?',
    m1: '◎',
    m2: '⬡',
    m3: '⇄',
    m4: '∿',
    m5: '◑',
    m6: '⏱',
    m7: '⚡',
    m8: '⚖',
    m9: '§',
  }
  return icons[key] || '·'
}
