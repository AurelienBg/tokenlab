'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLocalProject } from '@/lib/storage'
import { Project } from '@/lib/types'
import ModuleNav from '@/components/ModuleNav'
import Link from 'next/link'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const lp = getLocalProject(id)
    if (lp) {
      setProject(lp.project)
    } else {
      window.location.href = '/projects'
    }

    function onModuleSaved(e: Event) {
      const detail = (e as CustomEvent).detail
      if (detail?.projectId === id) {
        const updated = getLocalProject(id)
        if (updated) setProject(updated.project)
      }
    }
    window.addEventListener('tokenlab:module-saved', onModuleSaved)
    return () => window.removeEventListener('tokenlab:module-saved', onModuleSaved)
  }, [id])

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted text-sm">
        Chargement…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Project sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-border bg-sidebar/50 py-4 px-3 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-4 px-3">
          <Link href="/projects" className="text-xs text-muted hover:text-foreground transition-colors">
            ← Projets
          </Link>
          <div className="mt-2">
            <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
            {project.token_ticker && (
              <p className="text-xs text-muted font-mono">${project.token_ticker}</p>
            )}
          </div>
        </div>
        <ModuleNav project={project} />
      </aside>

      {/* Page content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
