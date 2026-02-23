'use client'

import { create } from 'zustand'

import { toast } from '@/components/hooks/use-toast'
import {
  App,
  AppInstance,
  ApprovalRequest,
  Notification,
  User,
  Workbench,
  WorkspaceWithDev
} from '@/domain/model'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'
import { refreshToken } from '@/view-model/authentication-view-model'
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsAsRead
} from '@/view-model/notification-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceListWithDev } from '@/view-model/workspace-view-model'

export type AppStateStore = {
  workspaces: WorkspaceWithDev[] | undefined
  workbenches: Workbench[] | undefined
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined
  notifications: Notification[] | undefined
  approvalRequests: ApprovalRequest[] | undefined
  unreadNotificationsCount: number | undefined

  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  refreshApps: () => Promise<void>
  refreshAppInstances: () => Promise<void>
  refreshNotifications: () => Promise<void>
  refreshApprovalRequests: () => Promise<void>
  refreshUnreadNotificationsCount: () => Promise<void>
  startNotificationsPolling: (intervalMs?: number) => void
  stopNotificationsPolling: () => void
  clearState: () => void
  initialize: (user?: User) => Promise<void>

  contentRect: DOMRect | null
  setContentRect: (rect: DOMRect | null) => void
  notificationsPollingInterval: ReturnType<typeof setInterval> | null
}

/**
 * Shallow-compare two sorted arrays by their serialized form.
 * Returns the existing array if data hasn't changed, avoiding unnecessary re-renders.
 */
function stableUpdate<T>(existing: T[] | undefined, incoming: T[]): T[] {
  if (
    existing &&
    existing.length === incoming.length &&
    JSON.stringify(existing) === JSON.stringify(incoming)
  ) {
    return existing
  }
  return incoming
}

export const useAppStateStore = create<AppStateStore>((set, get) => ({
  workspaces: undefined,
  workbenches: undefined,
  apps: undefined,
  appInstances: undefined,
  notifications: undefined,
  approvalRequests: undefined,
  unreadNotificationsCount: undefined,
  notificationsPollingInterval: null,

  refreshWorkspaces: async () => {
    const result = await workspaceListWithDev()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      const sorted = result.data.sort(
        (a, b) =>
          (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0)
      )
      const stable = stableUpdate(get().workspaces, sorted)
      if (stable !== get().workspaces) {
        set({ workspaces: stable })
      }
    }
  },

  refreshWorkbenches: async () => {
    const result = await workbenchList()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      const sorted = result.data.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      )
      const stable = stableUpdate(get().workbenches, sorted)
      if (stable !== get().workbenches) {
        set({ workbenches: stable })
      }
    }
  },

  refreshApps: async () => {
    const result = await appList()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      const sorted = result.data.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : 0
      )
      const stable = stableUpdate(get().apps, sorted)
      if (stable !== get().apps) {
        set({ apps: stable })
      }
    }
  },

  refreshAppInstances: async () => {
    const result = await listAppInstances()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    if (result.data) {
      const sorted = result.data.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
      const stable = stableUpdate(get().appInstances, sorted)
      if (stable !== get().appInstances) {
        set({ appInstances: stable })
      }
    }
  },

  refreshNotifications: async () => {
    // Optimization: Check unread count first
    const countResult = await countUnreadNotifications()

    if (countResult.data !== undefined) {
      set({ unreadNotificationsCount: countResult.data })
    }

    // If there are no unread notifications and we already have a list,
    // we skip the full fetch to save bandwidth/resources.
    // However, if we don't have ANY notifications yet (undefined), we still fetch once.
    if (countResult.data === 0 && get().notifications !== undefined) {
      return
    }

    const result = await listNotifications()
    if (result.error) {
      // Avoid spamming toasts for background polling errors
      console.error('Failed to refresh notifications:', result.error)
      return
    }
    if (result.data) {
      // Logic for system notifications (e.g., refresh token)
      const systemNotifications = result.data.filter(
        (n) => n.content?.systemNotification
      )
      const regularNotifications = result.data.filter(
        (n) => !n.content?.systemNotification
      )

      // Set only regular notifications to the state (don't display system notifications)
      const stableNotifications = stableUpdate(
        get().notifications,
        regularNotifications
      )
      if (stableNotifications !== get().notifications) {
        set({ notifications: stableNotifications })
      }

      // Handle system notifications
      if (systemNotifications.length > 0) {
        const needsRefresh = systemNotifications.some(
          (n) => n.content?.systemNotification?.refreshJWTRequired
        )

        if (needsRefresh) {
          await refreshToken()
        }

        // Mark system notifications as read so they don't stay in the unread count
        const systemIds = systemNotifications
          .map((n) => n.id)
          .filter((id): id is string => !!id)

        if (systemIds.length > 0) {
          await markNotificationsAsRead(systemIds)
          // Refresh unread count to reflect the marking as read
          get().refreshUnreadNotificationsCount()
        }
      }
    }
  },

  refreshApprovalRequests: async () => {
    const result = await listApprovalRequests()
    if (result.error) {
      console.error('Failed to refresh approval requests:', result.error)
      return
    }
    if (result.data) {
      const stable = stableUpdate(get().approvalRequests, result.data)
      if (stable !== get().approvalRequests) {
        set({ approvalRequests: stable })
      }
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

    const interval = setInterval(() => {
      refreshNotifications()
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
      approvalRequests: undefined,
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
      get().refreshAppInstances(),
      get().refreshApprovalRequests()
    ])

    get().startNotificationsPolling()
  },

  contentRect: null,
  setContentRect: (rect: DOMRect | null) => set({ contentRect: rect })
}))

// Convenience alias matching legacy naming
export const useAppState = useAppStateStore
