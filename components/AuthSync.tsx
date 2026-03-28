'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import { getAllLocalProjectsRaw } from '@/lib/storage'
import { migrateLocalToCloud, cloudGetAllModuleData, cloudGetProjects } from '@/lib/cloudStorage'
import { saveLocalProject, saveLocalModuleData } from '@/lib/storage'

// AuthSync runs silently in the background:
// 1. On sign-in → pushes all localStorage projects to Supabase (migration)
// 2. On mount with existing session → pulls Supabase data into localStorage (multi-device sync)

export function AuthSync() {
  const { user, loading } = useAuth()
  const didSync = useRef(false)

  useEffect(() => {
    if (loading || !user || didSync.current) return
    didSync.current = true

    async function sync() {
      try {
        // 1. Push local → cloud (migration / backup)
        const localProjects = getAllLocalProjectsRaw()
        if (localProjects.length > 0) {
          await migrateLocalToCloud(localProjects)
        }

        // 2. Pull cloud → local (multi-device sync)
        // Cloud takes priority for projects that exist in both places
        const cloudProjects = await cloudGetProjects()
        for (const cloudProject of cloudProjects) {
          saveLocalProject(cloudProject)
          try {
            const cloudModules = await cloudGetAllModuleData(cloudProject.id)
            for (const moduleData of Object.values(cloudModules)) {
              if (moduleData) saveLocalModuleData(moduleData)
            }
          } catch {
            // ignore per-project module errors
          }
        }
      } catch {
        // Sync errors are silent — app works fine with localStorage
      }
    }

    sync()
  }, [user, loading])

  // Reset sync flag on sign out so next login re-syncs
  useEffect(() => {
    if (!loading && !user) {
      didSync.current = false
    }
  }, [user, loading])

  return null
}
