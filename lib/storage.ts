// localStorage helpers — used for anonymous users
import { Project, ModuleData, ModuleKey, LocalProject } from './types'

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
    setAllLocalProjects(all)
  }
}

export function generateId(): string {
  return crypto.randomUUID()
}
