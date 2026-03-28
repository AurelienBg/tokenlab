'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MODULES } from '@/lib/constants'
import { Project } from '@/lib/types'

interface Props {
  project: Project
}

export default function ModuleNav({ project }: Props) {
  const pathname = usePathname()
  const base = `/project/${project.id}`

  const navItems = [
    { href: `${base}/dashboard`, label: 'Dashboard', icon: '◈' },
    ...MODULES.map((m) => ({
      href: `${base}/${m.path}`,
      label: m.shortLabel,
      sublabel: m.label.replace(/^(Étape \d+ — |Module \d+ — )/, ''),
      icon: moduleIcon(m.key),
      isComplete: !!(project.completed_modules & (1 << MODULES.indexOf(m))),
    })),
    { href: `${base}/coach`, label: 'Coach IA', icon: '✦' },
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
            <span className="text-xs w-4 text-center shrink-0">{item.icon}</span>
            <span className="flex-1 truncate">
              {'sublabel' in item ? (
                <span className="flex flex-col">
                  <span className="text-xs font-medium">{item.label}</span>
                  <span className="text-[10px] opacity-60 truncate">{'sublabel' in item ? item.sublabel : ''}</span>
                </span>
              ) : (
                item.label
              )}
            </span>
            {'isComplete' in item && item.isComplete && (
              <span className="text-green text-xs shrink-0">✓</span>
            )}
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
