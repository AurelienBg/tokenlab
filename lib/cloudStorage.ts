// Supabase CRUD helpers — used when authenticated
import { supabase } from './supabase'
import { Project, ModuleData, ModuleKey, LocalProject } from './types'

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function cloudGetProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function cloudGetProject(id: string): Promise<Project | undefined> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return undefined
  return data
}

export async function cloudSaveProject(project: Project): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { id, created_at, ...rest } = project
  await supabase.from('projects').upsert({ id, owner_id: user.id, created_at, ...rest })
}

export async function cloudDeleteProject(id: string): Promise<void> {
  await supabase.from('projects').delete().eq('id', id)
}

// ─── Module data ──────────────────────────────────────────────────────────────

export async function cloudGetModuleData(projectId: string, moduleKey: ModuleKey): Promise<ModuleData | undefined> {
  const { data, error } = await supabase
    .from('module_data')
    .select('*')
    .eq('project_id', projectId)
    .eq('module_key', moduleKey)
    .single()
  if (error || !data) return undefined
  return data
}

export async function cloudGetAllModuleData(projectId: string): Promise<Partial<Record<ModuleKey, ModuleData>>> {
  const { data, error } = await supabase
    .from('module_data')
    .select('*')
    .eq('project_id', projectId)
  if (error) throw error
  const result: Partial<Record<ModuleKey, ModuleData>> = {}
  for (const row of (data ?? [])) {
    result[row.module_key as ModuleKey] = row
  }
  return result
}

export async function cloudSaveModuleData(moduleData: ModuleData): Promise<void> {
  const { id, ...rest } = moduleData
  await supabase.from('module_data').upsert({ id, ...rest })
}

// ─── Migration: localStorage → Supabase ──────────────────────────────────────

export async function migrateLocalToCloud(localProjects: LocalProject[]): Promise<void> {
  for (const lp of localProjects) {
    try {
      await cloudSaveProject(lp.project)
      for (const moduleData of Object.values(lp.modules)) {
        if (moduleData) {
          try {
            await cloudSaveModuleData(moduleData)
          } catch {
            // skip
          }
        }
      }
    } catch {
      // skip
    }
  }
}
