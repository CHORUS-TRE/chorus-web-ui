'use client'

import { create } from 'zustand'

import {
  DEFAULT_INSTANCE_CONFIG,
  INSTANCE_CONFIG_KEYS,
  InstanceConfig,
  InstanceLogo,
  InstanceLogoSchema,
  InstanceTag,
  InstanceTagSchema,
  InstanceTheme,
  InstanceThemeSchema
} from '@/domain/model/instance-config'
import {
  DEFAULT_WORKSPACE_CONFIG,
  WORKSPACE_CONFIG_KEY,
  WorkspaceConfig,
  WorkspaceConfigSchema
} from '@/domain/model/workspace-config'
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
  isCookieConsentOpen: boolean

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

  // Workspace config helpers (typed JSON object)
  getWorkspaceConfig: (workspaceId: string) => WorkspaceConfig
  setWorkspaceConfig: (
    workspaceId: string,
    config: Partial<WorkspaceConfig>
  ) => Promise<boolean>

  // Instance config helpers (global platform configuration)
  getInstanceConfig: () => InstanceConfig
  getInstanceName: () => string
  getInstanceHeadline: () => string
  getInstanceTagline: () => string
  getInstanceWebsite: () => string
  getInstanceTags: () => InstanceTag[]
  getInstanceLogo: () => InstanceLogo | null
  getInstanceTheme: () => InstanceTheme | null

  setInstanceName: (name: string) => Promise<boolean>
  setInstanceHeadline: (headline: string) => Promise<boolean>
  setInstanceTagline: (tagline: string) => Promise<boolean>
  setInstanceWebsite: (website: string) => Promise<boolean>
  setInstanceTags: (tags: InstanceTag[]) => Promise<boolean>
  setInstanceLogo: (logo: InstanceLogo | null) => Promise<boolean>
  setInstanceTheme: (theme: InstanceTheme | null) => Promise<boolean>

  // UI Actions
  setCookieConsentOpen: (open: boolean) => void
}

export const useDevStoreCache = create<DevStoreCacheState>((set, get) => ({
  // Initial state
  global: {},
  user: {},
  workspaces: new Map(),
  isGlobalLoaded: false,
  isUserLoaded: false,
  loadedWorkspaces: new Set(),
  isCookieConsentOpen: false,

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
    const result = await putWorkspaceEntry(workspaceId, { key, value })
    if (!result.error) {
      set((state) => {
        const newWorkspaces = new Map(state.workspaces)
        const current = newWorkspaces.get(workspaceId) || {}
        newWorkspaces.set(workspaceId, { ...current, [key]: value })
        return { workspaces: newWorkspaces }
      })
      return true
    }
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
  },

  // Get workspace config as typed object (with defaults)
  getWorkspaceConfig: (workspaceId: string) => {
    const configStr = get().workspaces.get(workspaceId)?.[WORKSPACE_CONFIG_KEY]
    if (!configStr) {
      return { ...DEFAULT_WORKSPACE_CONFIG }
    }

    try {
      const parsed = JSON.parse(configStr)
      const validated = WorkspaceConfigSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      console.error('Invalid workspace config:', validated.error.issues)
      return { ...DEFAULT_WORKSPACE_CONFIG }
    } catch (e) {
      console.error('Error parsing workspace config:', e)
      return { ...DEFAULT_WORKSPACE_CONFIG }
    }
  },

  // Set workspace config (merges with existing)
  setWorkspaceConfig: async (
    workspaceId: string,
    config: Partial<WorkspaceConfig>
  ) => {
    // Get existing config
    const existing = get().getWorkspaceConfig(workspaceId)
    // Deep merge with new config
    const merged: WorkspaceConfig = {
      ...existing,
      ...config,
      security: { ...existing.security, ...config.security },
      resources: {
        ...existing.resources,
        ...config.resources,
        coldStorage: {
          ...existing.resources.coldStorage,
          ...config.resources?.coldStorage
        },
        hotStorage: {
          ...existing.resources.hotStorage,
          ...config.resources?.hotStorage
        }
      },
      services: { ...existing.services, ...config.services }
    }

    // Save to backend
    return get().setWorkspace(
      workspaceId,
      WORKSPACE_CONFIG_KEY,
      JSON.stringify(merged)
    )
  },

  // ============================================
  // Instance Configuration Helpers
  // ============================================

  // Get full instance config (assembled from individual keys)
  getInstanceConfig: () => {
    const state = get()
    return {
      name: state.getInstanceName(),
      headline: state.getInstanceHeadline(),
      tagline: state.getInstanceTagline(),
      website: state.getInstanceWebsite(),
      tags: state.getInstanceTags(),
      logo: state.getInstanceLogo(),
      theme: state.getInstanceTheme()
    }
  },

  // Individual getters with defaults
  getInstanceName: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.NAME]
    return value || DEFAULT_INSTANCE_CONFIG.name
  },

  getInstanceHeadline: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.HEADLINE]
    return value || DEFAULT_INSTANCE_CONFIG.headline
  },

  getInstanceTagline: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.TAGLINE]
    return value || DEFAULT_INSTANCE_CONFIG.tagline
  },

  getInstanceWebsite: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.WEBSITE]
    return value || DEFAULT_INSTANCE_CONFIG.website
  },

  getInstanceTags: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.TAGS]
    if (!value) return DEFAULT_INSTANCE_CONFIG.tags

    try {
      const parsed = JSON.parse(value)
      const validated = InstanceTagSchema.array().safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      console.error('Invalid instance tags:', validated.error.issues)
      return DEFAULT_INSTANCE_CONFIG.tags
    } catch (e) {
      console.error('Error parsing instance tags:', e)
      return DEFAULT_INSTANCE_CONFIG.tags
    }
  },

  getInstanceLogo: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.LOGO]
    if (!value) return null

    try {
      const parsed = JSON.parse(value)
      const validated = InstanceLogoSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      console.error('Invalid instance logo:', validated.error.issues)
      return null
    } catch (e) {
      console.error('Error parsing instance logo:', e)
      return null
    }
  },

  getInstanceTheme: () => {
    const value = get().global[INSTANCE_CONFIG_KEYS.THEME]
    if (!value) return null

    try {
      const parsed = JSON.parse(value)
      const validated = InstanceThemeSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      console.error('Invalid instance theme:', validated.error.issues)
      return null
    } catch (e) {
      console.error('Error parsing instance theme:', e)
      return null
    }
  },

  // Individual setters
  setInstanceName: async (name: string) => {
    return get().setGlobal(INSTANCE_CONFIG_KEYS.NAME, name)
  },

  setInstanceHeadline: async (headline: string) => {
    return get().setGlobal(INSTANCE_CONFIG_KEYS.HEADLINE, headline)
  },

  setInstanceTagline: async (tagline: string) => {
    return get().setGlobal(INSTANCE_CONFIG_KEYS.TAGLINE, tagline)
  },

  setInstanceWebsite: async (website: string) => {
    return get().setGlobal(INSTANCE_CONFIG_KEYS.WEBSITE, website)
  },

  setInstanceTags: async (tags: InstanceTag[]) => {
    return get().setGlobal(INSTANCE_CONFIG_KEYS.TAGS, JSON.stringify(tags))
  },

  setInstanceLogo: async (logo: InstanceLogo | null) => {
    if (logo === null) {
      return get().deleteGlobal(INSTANCE_CONFIG_KEYS.LOGO)
    }
    return get().setGlobal(INSTANCE_CONFIG_KEYS.LOGO, JSON.stringify(logo))
  },

  setInstanceTheme: async (theme: InstanceTheme | null) => {
    if (theme === null) {
      return get().deleteGlobal(INSTANCE_CONFIG_KEYS.THEME)
    }
    return get().setGlobal(INSTANCE_CONFIG_KEYS.THEME, JSON.stringify(theme))
  },

  // UI Actions
  setCookieConsentOpen: (open: boolean) => set({ isCookieConsentOpen: open })
}))
