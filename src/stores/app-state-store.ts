'use client'

import { create } from 'zustand'

import { toast } from '@/components/hooks/use-toast'
import {
  App,
  AppInstance,
  User,
  Workbench,
  WorkspaceWithDev
} from '@/domain/model'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceListWithDev } from '@/view-model/workspace-view-model'

export type AppStateStore = {
  workspaces: WorkspaceWithDev[] | undefined
  workbenches: Workbench[] | undefined
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined

  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  refreshApps: () => Promise<void>
  refreshAppInstances: () => Promise<void>
  clearState: () => void
  initialize: (user?: User) => Promise<void>

  immersiveUIVisible: boolean
  setImmersiveUIVisible: (visible: boolean) => void

  contentRect: DOMRect | null
  setContentRect: (rect: DOMRect | null) => void
}

export const useAppStateStore = create<AppStateStore>((set, get) => ({
  workspaces: undefined,
  workbenches: undefined,
  apps: undefined,
  appInstances: undefined,
  users: undefined,

  refreshWorkspaces: async () => {
    const result = await workspaceListWithDev()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      set({
        workspaces: result.data.sort(
          (a, b) =>
            (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0)
        )
      })
    }
  },

  refreshWorkbenches: async () => {
    const result = await workbenchList()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      set({
        workbenches: result.data.sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0
        )
      })
    }
  },

  refreshApps: async () => {
    const result = await appList()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      set({
        apps: result.data.sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0
        )
      })
    }
  },

  refreshAppInstances: async () => {
    const result = await listAppInstances()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      set({
        appInstances: result.data.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      })
    }
  },

  clearState: () => {
    set({
      workspaces: undefined,
      workbenches: undefined,
      apps: undefined,
      appInstances: undefined
    })
    const { clearUserData } = useDevStoreCache.getState()
    clearUserData()
  },

  initialize: async (user?: User) => {
    if (!user) return
    const devStore = useDevStoreCache.getState()
    await devStore.initGlobal()
    await devStore.initUser()

    await Promise.all([
      get().refreshWorkspaces(),
      get().refreshWorkbenches(),
      get().refreshApps(),
      get().refreshAppInstances()
    ])
  },

  immersiveUIVisible: true,
  setImmersiveUIVisible: (visible: boolean) =>
    set({ immersiveUIVisible: visible }),

  contentRect: null,
  setContentRect: (rect: DOMRect | null) => set({ contentRect: rect })
}))

// Convenience alias matching legacy naming
export const useAppState = useAppStateStore
