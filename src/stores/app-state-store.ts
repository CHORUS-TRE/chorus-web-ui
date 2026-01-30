'use client'

import { create } from 'zustand'

import { toast } from '@/components/hooks/use-toast'
import {
  App,
  AppInstance,
  Notification,
  User,
  Workbench,
  WorkspaceWithDev
} from '@/domain/model'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
import {
  countUnreadNotifications,
  listNotifications
} from '@/view-model/notification-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceListWithDev } from '@/view-model/workspace-view-model'

export type AppStateStore = {
  workspaces: WorkspaceWithDev[] | undefined
  workbenches: Workbench[] | undefined
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined
  notifications: Notification[] | undefined
  unreadNotificationsCount: number | undefined

  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  refreshApps: () => Promise<void>
  refreshAppInstances: () => Promise<void>
  refreshNotifications: () => Promise<void>
  refreshUnreadNotificationsCount: () => Promise<void>
  startNotificationsPolling: (intervalMs?: number) => void
  stopNotificationsPolling: () => void
  clearState: () => void
  initialize: (user?: User) => Promise<void>

  immersiveUIVisible: boolean
  setImmersiveUIVisible: (visible: boolean) => void

  contentRect: DOMRect | null
  setContentRect: (rect: DOMRect | null) => void
  notificationsPollingInterval: ReturnType<typeof setInterval> | null
}

export const useAppStateStore = create<AppStateStore>((set, get) => ({
  workspaces: undefined,
  workbenches: undefined,
  apps: undefined,
  appInstances: undefined,
  notifications: undefined,
  unreadNotificationsCount: undefined,
  users: undefined,
  notificationsPollingInterval: null,

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

  refreshNotifications: async () => {
    const result = await listNotifications()
    if (result.error) {
      // Avoid spamming toasts for background polling errors
      console.error('Failed to refresh notifications:', result.error)
      return
    }
    if (result.data) {
      set({ notifications: result.data })
    }
  },

  refreshUnreadNotificationsCount: async () => {
    const result = await countUnreadNotifications()
    if (result.error) {
      console.error('Failed to refresh unread count:', result.error)
      return
    }
    if (result.data !== undefined) {
      set({ unreadNotificationsCount: result.data })
    }
  },

  startNotificationsPolling: (intervalMs: number = 30000) => {
    const {
      stopNotificationsPolling,
      refreshNotifications,
      refreshUnreadNotificationsCount
    } = get()
    stopNotificationsPolling()

    // Initial fetch
    refreshNotifications()
    refreshUnreadNotificationsCount()

    const interval = setInterval(() => {
      refreshNotifications()
      refreshUnreadNotificationsCount()
    }, intervalMs)

    set({ notificationsPollingInterval: interval })
  },

  stopNotificationsPolling: () => {
    const { notificationsPollingInterval } = get()
    if (notificationsPollingInterval) {
      clearInterval(notificationsPollingInterval)
      set({ notificationsPollingInterval: null })
    }
  },

  clearState: () => {
    get().stopNotificationsPolling()
    set({
      workspaces: undefined,
      workbenches: undefined,
      apps: undefined,
      appInstances: undefined,
      notifications: undefined,
      unreadNotificationsCount: undefined
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

    get().startNotificationsPolling()
  },

  immersiveUIVisible: true,
  setImmersiveUIVisible: (visible: boolean) =>
    set({ immersiveUIVisible: visible }),

  contentRect: null,
  setContentRect: (rect: DOMRect | null) => set({ contentRect: rect })
}))

// Convenience alias matching legacy naming
export const useAppState = useAppStateStore
