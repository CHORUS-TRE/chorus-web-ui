'use client'

import { create } from 'zustand'

import { errorToast } from '@/components/error-toast'
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
import type {
  FileSystemUploadItem,
  FolderUploadBatch
} from '@/types/file-system'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
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
  unreadNotificationsCount: number | undefined
  uploads: Record<string, FileSystemUploadItem> | undefined
  folderBatches: Record<string, FolderUploadBatch> | undefined

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
  addUpload: (upload: FileSystemUploadItem) => void
  updateUpload: (uploadId: string, patch: Partial<FileSystemUploadItem>) => void
  removeUpload: (uploadId: string) => void
  markUploadCancelled: (uploadId: string) => void
  hasActiveUploads: () => boolean
  addFolderBatch: (batch: FolderUploadBatch) => void
  updateFolderBatch: (
    batchId: string,
    patch: Partial<FolderUploadBatch>
  ) => void
  removeFolderBatch: (batchId: string) => void
  markFolderBatchCancelled: (batchId: string) => void

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
  unreadNotificationsCount: undefined,
  uploads: undefined,
  folderBatches: undefined,
  notificationsPollingInterval: null,

  refreshWorkspaces: async () => {
    const result = await workspaceListWithDev()
    if (result.error) {
      toast({ ...errorToast(result.error), variant: 'destructive' })
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
      toast({ ...errorToast(result.error), variant: 'destructive' })
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
      toast({ ...errorToast(result.error), variant: 'destructive' })
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
      toast({ ...errorToast(result.error), variant: 'destructive' })
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
    // Cheap poll: a single-row list request whose totalItems is the exact
    // unread count. Only fetch the full list (a second request) when the
    // count changed since last poll, or we don't have a list cached yet.
    const previousCount = get().unreadNotificationsCount
    const countResult = await countUnreadNotifications()

    if (countResult.error) {
      console.error('Failed to refresh notifications count:', countResult.error)
      return
    }

    const newCount = countResult.data ?? 0
    set({ unreadNotificationsCount: newCount })

    const countUnchanged =
      previousCount !== undefined && previousCount === newCount
    if (countUnchanged && get().notifications !== undefined) {
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
      const regularNotifications = result.data

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

  startNotificationsPolling: (intervalMs: number = 30 * 1000) => {
    const { stopNotificationsPolling, refreshNotifications } = get()
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
      unreadNotificationsCount: undefined,
      uploads: undefined,
      folderBatches: undefined
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

  addUpload: (upload) => {
    set((state) => ({
      uploads: { ...state.uploads, [upload.id]: upload }
    }))
  },

  updateUpload: (uploadId, patch) => {
    set((state) => {
      const existing = state.uploads?.[uploadId]
      if (!existing) return state
      return {
        uploads: { ...state.uploads, [uploadId]: { ...existing, ...patch } }
      }
    })
  },

  removeUpload: (uploadId) => {
    set((state) => {
      if (!state.uploads) return state
      const { [uploadId]: _upload, ...rest } = state.uploads
      return { uploads: rest }
    })
  },

  markUploadCancelled: (uploadId) => {
    set((state) => {
      const existing = state.uploads?.[uploadId]
      if (!existing) return state
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: { ...existing, cancelled: true }
        }
      }
    })
  },

  hasActiveUploads: () => {
    return Object.values(get().uploads ?? {}).some(
      (u) => !u.cancelled && u.uploadedParts < u.totalParts
    )
  },

  addFolderBatch: (batch) => {
    set((state) => ({
      folderBatches: { ...state.folderBatches, [batch.id]: batch }
    }))
  },

  updateFolderBatch: (batchId, patch) => {
    set((state) => {
      const existing = state.folderBatches?.[batchId]
      if (!existing) return state
      return {
        folderBatches: {
          ...state.folderBatches,
          [batchId]: { ...existing, ...patch }
        }
      }
    })
  },

  removeFolderBatch: (batchId) => {
    set((state) => {
      if (!state.folderBatches) return state
      const { [batchId]: _, ...rest } = state.folderBatches
      return { folderBatches: Object.keys(rest).length > 0 ? rest : undefined }
    })
  },

  markFolderBatchCancelled: (batchId) => {
    set((state) => {
      const existing = state.folderBatches?.[batchId]
      if (!existing) return state
      return {
        folderBatches: {
          ...state.folderBatches,
          [batchId]: { ...existing, cancelled: true }
        }
      }
    })
  },

  contentRect: null,
  setContentRect: (rect: DOMRect | null) => set({ contentRect: rect })
}))

// Convenience alias matching legacy naming
export const useAppState = useAppStateStore
