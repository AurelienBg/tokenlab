'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLocalProjects } from '@/lib/storage'
import { Project } from '@/lib/types'
import { useTheme } from './ThemeProvider'
import { useLang } from './LangProvider'

export default function Sidebar() {
  const pathname = usePathname()
  const [projects, setProjects] = useState<Project[]>([])
  const { theme, toggle } = useTheme()
  const { lang, t, toggle: toggleLang } = useLang()

  useEffect(() => {
    setProjects(getLocalProjects())
  }, [pathname])

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col border-r border-border bg-sidebar z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <TokenlabIcon />
        <span className="text-base font-bold tracking-tight text-foreground">Tokenlab</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <Link
          href="/projects/new"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors mb-4"
        >
          {t.newProject}
        </Link>

        {projects.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-muted px-3 mb-2 uppercase tracking-wider">
              {t.recentProjects}
            </p>
            <ul className="space-y-0.5">
              {projects.slice(0, 15).map((p) => {
                const isActive = pathname.startsWith(`/project/${p.id}`)
                return (
                  <li key={p.id}>
                    <Link
                      href={`/project/${p.id}/dashboard`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-accent font-medium'
                          : 'text-foreground hover:bg-surface-hover'
                      }`}
                    >
                      <span className="truncate flex-1">{p.name}</span>
                      {p.health_score > 0 && (
                        <span className={`text-xs font-mono ml-2 shrink-0 ${
                          p.health_score >= 70 ? 'text-green' :
                          p.health_score >= 40 ? 'text-yellow' : 'text-red'
                        }`}>
                          {p.health_score}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {projects.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-muted">{t.noProjects}</p>
            <p className="text-xs text-muted mt-1">{t.createFirst}</p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted font-mono">v0.1</span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs text-muted hover:text-foreground transition-colors font-mono font-semibold"
            title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            onClick={toggle}
            className="text-muted hover:text-foreground transition-colors"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/projects" className="text-xs text-muted hover:text-foreground transition-colors">
            {t.allProjects}
          </Link>
        </div>
      </div>
    </aside>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function TokenlabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke="#7C3AED" strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="6" fill="#7C3AED" opacity="0.2"/>
      <circle cx="11" cy="11" r="3" fill="#7C3AED"/>
      <path d="M11 1 L11 4 M11 18 L11 21 M1 11 L4 11 M18 11 L21 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
