'use client'

import { create } from 'zustand'

import {
  deleteGlobalEntry,
  deleteUserEntry,
  deleteWorkspaceEntry,
  listGlobalEntries,
  listUserEntries,
  listWorkspaceEntries,
  putGlobalEntry,
  putUserEntry,
  putWorkspaceEntry
} from '@/view-model/dev-store-view-model'

type DevStoreCacheState = {
  // Cache data
  global: Record<string, string>
  user: Record<string, string>
  workspaces: Map<string, Record<string, string>>

  // Loading states
  isGlobalLoaded: boolean
  isUserLoaded: boolean
  loadedWorkspaces: Set<string>

  // Initialize caches
  initGlobal: () => Promise<void>
  initUser: () => Promise<void>
  loadWorkspace: (workspaceId: string) => Promise<void>
  loadWorkspaces: (workspaceIds: string[]) => Promise<void>

  // Sync getters
  getGlobal: (key: string) => string | undefined
  getUser: (key: string) => string | undefined
  getWorkspace: (workspaceId: string, key: string) => string | undefined

  // Check if key exists (without fetching)
  hasGlobal: (key: string) => boolean
  hasUser: (key: string) => boolean
  hasWorkspace: (workspaceId: string, key: string) => boolean

  // Async setters (update backend + cache)
  setGlobal: (key: string, value: string) => Promise<boolean>
  setUser: (key: string, value: string) => Promise<boolean>
  setWorkspace: (
    workspaceId: string,
    key: string,
    value: string
  ) => Promise<boolean>

  // Delete operations
  deleteGlobal: (key: string) => Promise<boolean>
  deleteUser: (key: string) => Promise<boolean>
  deleteWorkspace: (workspaceId: string, key: string) => Promise<boolean>

  // Clear on logout
  clearUserData: () => void

  // Force refresh (for external updates)
  refreshGlobal: () => Promise<void>
  refreshUser: () => Promise<void>
  refreshWorkspace: (workspaceId: string) => Promise<void>
}

export const useDevStoreCache = create<DevStoreCacheState>((set, get) => ({
  // Initial state
  global: {},
  user: {},
  workspaces: new Map(),
  isGlobalLoaded: false,
  isUserLoaded: false,
  loadedWorkspaces: new Set(),

  // Initialize global cache (call before login if needed)
  initGlobal: async () => {
    if (get().isGlobalLoaded) return

    const result = await listGlobalEntries()
    if (result.data) {
      set({ global: result.data, isGlobalLoaded: true })
    } else {
      // Mark as loaded even on error to prevent infinite retries
      set({ isGlobalLoaded: true })
    }
  },

  // Initialize user cache (call after login)
  initUser: async () => {
    if (get().isUserLoaded) return

    const result = await listUserEntries()
    if (result.data) {
      set({ user: result.data, isUserLoaded: true })
    } else {
      set({ isUserLoaded: true })
    }
  },

  // Load entries for a single workspace
  loadWorkspace: async (workspaceId: string) => {
    if (get().loadedWorkspaces.has(workspaceId)) return

    const result = await listWorkspaceEntries(workspaceId)
    if (result.data) {
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        newWorkspaces.set(workspaceId, result.data!)
        const newLoaded = new Set(state.loadedWorkspaces)
        newLoaded.add(workspaceId)
        return { workspaces: newWorkspaces, loadedWorkspaces: newLoaded }
      })
    } else {
      // Mark as loaded even if empty/error
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        newWorkspaces.set(workspaceId, {})
        const newLoaded = new Set(state.loadedWorkspaces)
        newLoaded.add(workspaceId)
        return { workspaces: newWorkspaces, loadedWorkspaces: newLoaded }
      })
    }
  },

  // Batch load workspace entries
  loadWorkspaces: async (workspaceIds: string[]) => {
    const unloaded = workspaceIds.filter(
      (id) => !get().loadedWorkspaces.has(id)
    )
    await Promise.all(unloaded.map((id) => get().loadWorkspace(id)))
  },

  // Sync getters (instant lookup from cache)
  getGlobal: (key: string) => get().global[key],
  getUser: (key: string) => get().user[key],
  getWorkspace: (workspaceId: string, key: string) =>
    get().workspaces.get(workspaceId)?.[key],

  // Check existence
  hasGlobal: (key: string) => key in get().global,
  hasUser: (key: string) => key in get().user,
  hasWorkspace: (workspaceId: string, key: string) =>
    get().workspaces.get(workspaceId)?.[key] !== undefined,

  // Setters (update backend then cache)
  setGlobal: async (key: string, value: string) => {
    const result = await putGlobalEntry({ key, value })
    if (!result.error) {
      set((state) => ({ global: { ...state.global, [key]: value } }))
      return true
    }
    return false
  },

  setUser: async (key: string, value: string) => {
    const result = await putUserEntry({ key, value })
    if (!result.error) {
      set((state) => ({ user: { ...state.user, [key]: value } }))
      return true
    }
    return false
  },

  setWorkspace: async (workspaceId: string, key: string, value: string) => {
    console.log('[DevStoreCache] setWorkspace called:', {
      workspaceId,
      key,
      valueLength: value?.length
    })
    const result = await putWorkspaceEntry(workspaceId, { key, value })
    console.log('[DevStoreCache] putWorkspaceEntry result:', result)
    if (!result.error) {
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        const current = newWorkspaces.get(workspaceId) || {}
        newWorkspaces.set(workspaceId, { ...current, [key]: value })
        return { workspaces: newWorkspaces }
      })
      return true
    }
    console.error('[DevStoreCache] setWorkspace failed:', result.error)
    return false
  },

  // Delete operations
  deleteGlobal: async (key: string) => {
    const result = await deleteGlobalEntry(key)
    if (!result.error) {
      set((state) => {
        const { [key]: _, ...rest } = state.global
        return { global: rest }
      })
      return true
    }
    return false
  },

  deleteUser: async (key: string) => {
    const result = await deleteUserEntry(key)
    if (!result.error) {
      set((state) => {
        const { [key]: _, ...rest } = state.user
        return { user: rest }
      })
      return true
    }
    return false
  },

  deleteWorkspace: async (workspaceId: string, key: string) => {
    const result = await deleteWorkspaceEntry(workspaceId, key)
    if (!result.error) {
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        const current = newWorkspaces.get(workspaceId)
        if (current) {
          const { [key]: _, ...rest } = current
          newWorkspaces.set(workspaceId, rest)
        }
        return { workspaces: newWorkspaces }
      })
      return true
    }
    return false
  },

  // Clear user-specific data on logout
  clearUserData: () => {
    set({
      user: {},
      workspaces: new Map(),
      isUserLoaded: false,
      loadedWorkspaces: new Set()
    })
  },

  // Force refresh (bypasses loaded check)
  refreshGlobal: async () => {
    const result = await listGlobalEntries()
    if (result.data) {
      set({ global: result.data, isGlobalLoaded: true })
    }
  },

  refreshUser: async () => {
    const result = await listUserEntries()
    if (result.data) {
      set({ user: result.data, isUserLoaded: true })
    }
  },

  refreshWorkspace: async (workspaceId: string) => {
    const result = await listWorkspaceEntries(workspaceId)
    if (result.data) {
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        newWorkspaces.set(workspaceId, result.data!)
        return { workspaces: newWorkspaces }
      })
    }
  }
}))
