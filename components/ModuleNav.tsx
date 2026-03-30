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

  const navItems = [
    { href: `${base}/dashboard`, label: t.dashboard, icon: '◈' },
    ...MODULES.map((m) => {
      const ml = t.modules_labels[m.key]
      return {
        href: `${base}/${m.path}`,
        label: ml.shortLabel,
        sublabel: ml.label,
        icon: moduleIcon(m.key),
        isComplete: !!(project.completed_modules & (1 << MODULES.indexOf(m))),
      }
    }),
    { href: `${base}/simulation`, label: t.simulation, icon: '∿' },
    { href: `${base}/coach`, label: t.coachIA, icon: '✦' },
  ]

  return (
    <nav className="space-y-0.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== `${base}/dashboard` && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
              isActive
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-muted hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            {'isComplete' in item && item.isComplete ? (
              <span className="w-4 h-4 rounded-full bg-green/20 flex items-center justify-center shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3.5" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            ) : (
              <span className="text-xs w-4 text-center shrink-0 opacity-50">{item.icon}</span>
            )}
            <span className="flex-1 truncate">
              {'sublabel' in item ? (
                <span className="flex flex-col">
                  <span className={`text-xs font-medium ${'isComplete' in item && item.isComplete ? 'text-foreground' : ''}`}>{item.label}</span>
                  <span className="text-[10px] opacity-60 truncate">{item.sublabel}</span>
                </span>
              ) : (
                item.label
              )}
            </span>
          </Link>
        )
      })}
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
