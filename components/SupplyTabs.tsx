'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  projectId: string
}

export default function SupplyTabs({ projectId }: Props) {
  const pathname = usePathname()

  const tabs = [
    { label: 'Supply & Emission', href: `/project/${projectId}/module/4` },
    { label: 'Allocation', href: `/project/${projectId}/module/5` },
    { label: 'Simulation', href: `/project/${projectId}/simulation` },
  ]

  return (
    <div className="mb-6">
      <div className="flex gap-6 border-b border-border">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                active
                  ? 'text-accent border-accent'
                  : 'text-muted border-transparent hover:text-foreground'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
