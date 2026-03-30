// localStorage helpers — used for anonymous users
import { Project, ModuleData, ModuleKey, LocalProject } from './types'
import { computeHealthScore } from './healthScore'
import { MODULES, MODULE_BITS } from './constants'

const PROJECTS_KEY = 'tokenlab_projects'

function getAllLocalProjects(): LocalProject[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]')
  } catch {
    return []
  }
}

function setAllLocalProjects(projects: LocalProject[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function getLocalProjects(): Project[] {
  return getAllLocalProjects().map((lp) => lp.project)
}

export function getLocalProject(id: string): LocalProject | undefined {
  return getAllLocalProjects().find((lp) => lp.project.id === id)
}

export function saveLocalProject(project: Project): void {
  const all = getAllLocalProjects()
  const idx = all.findIndex((lp) => lp.project.id === project.id)
  if (idx >= 0) {
    all[idx].project = project
  } else {
    all.unshift({ project, modules: {} })
  }
  setAllLocalProjects(all)
}

export function deleteLocalProject(id: string): void {
  const all = getAllLocalProjects().filter((lp) => lp.project.id !== id)
  setAllLocalProjects(all)
}

export function getLocalModuleData(projectId: string, moduleKey: ModuleKey): ModuleData | undefined {
  const lp = getLocalProject(projectId)
  return lp?.modules[moduleKey]
}

export function saveLocalModuleData(moduleData: ModuleData): void {
  const all = getAllLocalProjects()
  const idx = all.findIndex((lp) => lp.project.id === moduleData.project_id)
  if (idx >= 0) {
    all[idx].modules[moduleData.module_key] = moduleData

    // Recompute health score and completed_modules bitmask
    const modules = all[idx].modules
    const health = computeHealthScore(modules)
    let completedBits = 0
    for (const mod of MODULES) {
      if (modules[mod.key]?.is_complete) {
        completedBits |= MODULE_BITS[mod.key]
      }
    }
    all[idx].project.health_score = health.total
    all[idx].project.completed_modules = completedBits
    all[idx].project.updated_at = new Date().toISOString()

    setAllLocalProjects(all)
  }
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function duplicateLocalProject(id: string, suffix = '(copie)'): string | null {
  const lp = getLocalProject(id)
  if (!lp) return null
  const newId = crypto.randomUUID()
  const now = new Date().toISOString()
  const newLp: LocalProject = {
    project: {
      ...lp.project,
      id: newId,
      name: lp.project.name + ' ' + suffix,
      created_at: now,
      updated_at: now,
    },
    modules: Object.fromEntries(
      Object.entries(lp.modules).map(([key, mod]) => [
        key,
        { ...mod, id: crypto.randomUUID(), project_id: newId },
      ])
    ) as typeof lp.modules,
  }
  const all = getAllLocalProjects()
  const idx = all.findIndex((p) => p.project.id === id)
  all.splice(idx + 1, 0, newLp)
  setAllLocalProjects(all)
  return newId
}

// Exposed for AuthSync — returns full LocalProject array for migration
export function getAllLocalProjectsRaw(): LocalProject[] {
  return getAllLocalProjects()
}
