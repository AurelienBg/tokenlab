'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  projectId: string
}

export default function SupplyTabs({ projectId }: Props) {
  const pathname = usePathname()

  const tabs = [
    { label: 'M4 — Supply & Emission', href: `/project/${projectId}/module/4` },
    { label: 'M5 — Allocation', href: `/project/${projectId}/module/5` },
    { label: 'Simulation', href: `/project/${projectId}/simulation` },
  ]

  return (
    <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
              active
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
