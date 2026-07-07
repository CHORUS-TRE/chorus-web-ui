'use client'

import { create } from 'zustand'

import { errorToast } from '@/components/error-toast'
import { toast } from '@/components/hooks/use-toast'
import {
  App,
  AppInstance,
  ApprovalRequestCount,
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
import { countMyApprovalRequests } from '@/view-model/approval-request-view-model'
import { refreshToken } from '@/view-model/authentication-view-model'
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsAsRead
} from '@/view-model/notification-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceListWithDev } from '@/view-model/workspace-view-model'

// Explicit poll truncation policy: the store caches only the latest N
// notifications (the backend defaults to 20 if no limit is given at all).
// Older unread notifications still count toward unreadNotificationsCount
// (derived from totalItems) but are only reachable through the paginated
// Messages inbox, not this cached list.
const NOTIFICATIONS_POLL_LIMIT = 100

// Page size used when searching unread notifications for the one(s) linked
// to a decided approval request. Bounded by totalItems so it never loops
// forever, but pages past the first 100 so a match isn't missed just because
// newer unread notifications pushed it off page one (see onApprovalDecision).
const READ_SYNC_SEARCH_PAGE_SIZE = 100
const READ_SYNC_SEARCH_MAX_PAGES = 50

// chorus-backend caches GetNotifications/CountUnreadNotifications for 2s
// (pkg/notification/service/middleware/caching.go, defaultCacheExpiration)
// and MarkNotificationsAsRead does not invalidate that cache. Re-reading
// immediately after a mark-as-read write can replay the stale (still-unread)
// cached response, so callers that write-then-refresh wait this long first.
// Not a client-side choice — it mirrors a real backend cache TTL.
export const NOTIFICATION_WRITE_CACHE_DELAY_MS = 2000

export type AppStateStore = {
  workspaces: WorkspaceWithDev[] | undefined
  workbenches: Workbench[] | undefined
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined
  notifications: Notification[] | undefined
  unreadNotificationsCount: number | undefined
  approvalRequestCounts: ApprovalRequestCount | undefined
  uploads: Record<string, FileSystemUploadItem> | undefined
  folderBatches: Record<string, FolderUploadBatch> | undefined

  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  refreshApps: () => Promise<void>
  refreshAppInstances: () => Promise<void>
  refreshNotifications: () => Promise<void>
  refreshUnreadNotificationsCount: () => Promise<void>
  refreshApprovalRequestCounts: () => Promise<void>
  onApprovalDecision: (requestId: string) => Promise<void>
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

/**
 * Finds the ids of unread notifications linked to `requestId`, paging
 * through the unread set (bounded by totalItems) instead of only checking
 * the first page — a decided request's notification may not be among the
 * newest unread items.
 */
async function findUnreadNotificationIdsForApprovalRequest(
  requestId: string
): Promise<string[]> {
  const matches: string[] = []
  let offset = 0

  for (let page = 0; page < READ_SYNC_SEARCH_MAX_PAGES; page++) {
    const result = await listNotifications({
      isRead: false,
      paginationLimit: READ_SYNC_SEARCH_PAGE_SIZE,
      paginationOffset: offset
    })
    if (result.error || !result.data || result.data.length === 0) break

    for (const n of result.data) {
      if (
        n.id &&
        n.content?.approvalRequestNotification?.approvalRequestId === requestId
      ) {
        matches.push(n.id)
      }
    }

    offset += result.data.length
    const total = result.totalItems ?? result.data.length
    if (offset >= total) break
  }

  return matches
}

export const useAppStateStore = create<AppStateStore>((set, get) => ({
  workspaces: undefined,
  workbenches: undefined,
  apps: undefined,
  appInstances: undefined,
  notifications: undefined,
  unreadNotificationsCount: undefined,
  approvalRequestCounts: undefined,
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

    const result = await listNotifications({
      paginationLimit: NOTIFICATIONS_POLL_LIMIT
    })
    if (result.error) {
      // Avoid spamming toasts for background polling errors
      console.error('Failed to refresh notifications:', result.error)
      return
    }
    if (result.data) {
      const systemNotifications = result.data.filter(
        (n) => n.content?.systemNotification
      )
      // System notifications are never rendered; only regular ones go to state.
      const regularNotifications = result.data.filter(
        (n) => !n.content?.systemNotification
      )

      const stableNotifications = stableUpdate(
        get().notifications,
        regularNotifications
      )
      if (stableNotifications !== get().notifications) {
        set({ notifications: stableNotifications })
      }

      if (systemNotifications.length > 0) {
        const needsRefresh = systemNotifications.some(
          (n) => n.content?.systemNotification?.refreshJWTRequired
        )
        if (needsRefresh) {
          await refreshToken()
        }

        // Since system notifications are invisible in the UI, an unread one
        // would otherwise inflate unreadNotificationsCount forever with
        // nothing for the user to clear it with. Mark them read once handled;
        // the corrected count lands on the next poll (see
        // NOTIFICATION_WRITE_CACHE_DELAY_MS for why not immediately here).
        const unreadSystemIds = systemNotifications
          .filter((n) => !n.readAt && n.id)
          .map((n) => n.id as string)
        if (unreadSystemIds.length > 0) {
          await markNotificationsAsRead(unreadSystemIds)
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

  refreshApprovalRequestCounts: async () => {
    const result = await countMyApprovalRequests()
    if (result.error) {
      console.error('Failed to refresh approval request counts:', result.error)
      return
    }
    if (result.data) {
      set({ approvalRequestCounts: result.data })
    }
  },

  onApprovalDecision: async (requestId: string) => {
    // Best-effort: an approval must not fail or block because the inbox
    // couldn't sync. Errors here are logged, never surfaced or rethrown.
    let markedAsRead = false
    try {
      const notificationIds =
        await findUnreadNotificationIdsForApprovalRequest(requestId)
      if (notificationIds.length > 0) {
        await markNotificationsAsRead(notificationIds)
        markedAsRead = true
      }
    } catch (error) {
      console.error(
        'Failed to mark linked notifications as read after approval decision:',
        error
      )
    }

    // See NOTIFICATION_WRITE_CACHE_DELAY_MS: only needed when we actually
    // wrote a read-state change that the next refresh would otherwise re-read
    // stale from the backend cache.
    if (markedAsRead) {
      await new Promise((resolve) =>
        setTimeout(resolve, NOTIFICATION_WRITE_CACHE_DELAY_MS)
      )
    }

    await Promise.all([
      get().refreshNotifications(),
      get().refreshApprovalRequestCounts()
    ])
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
      approvalRequestCounts: undefined,
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
      get().refreshAppInstances(),
      get().refreshApprovalRequestCounts()
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
