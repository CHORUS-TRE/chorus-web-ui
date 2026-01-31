'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WorkspaceFilters {
  showMyWorkspaces: boolean
  showCenter: boolean
  showProject: boolean
}

interface UserPreferencesState {
  // Workspace filters
  workspaceFilters: WorkspaceFilters
  setWorkspaceFilter: <K extends keyof WorkspaceFilters>(
    key: K,
    value: WorkspaceFilters[K]
  ) => void

  // Search queries
  workspaceSearchQuery: string
  setWorkspaceSearchQuery: (query: string) => void
  sessionSearchQuery: string
  setSessionSearchQuery: (query: string) => void

  // Session filters
  showMySessions: boolean
  setShowMySessions: (value: boolean) => void

  // View preferences
  showWorkspacesTable: boolean
  toggleWorkspaceView: () => void
  showUsersTable: boolean
  toggleUsersView: () => void

  // Left sidebar
  showLeftSidebar: boolean
  toggleLeftSidebar: () => void

  // Right sidebar
  showRightSidebar: boolean
  toggleRightSidebar: () => void

  // Sessions view mode
  sessionsViewMode: 'grid' | 'table'
  setSessionsViewMode: (mode: 'grid' | 'table') => void

  // App Store hero
  showAppStoreHero: boolean
  toggleAppStoreHero: () => void

  // Getting started tour
  hasSeenGettingStartedTour: boolean
  setHasSeenGettingStartedTour: (value: boolean) => void

  // Reset
  resetPreferences: () => void
}

const defaultPreferences = {
  workspaceFilters: {
    showMyWorkspaces: true,
    showCenter: false,
    showProject: true
  },
  workspaceSearchQuery: '',
  sessionSearchQuery: '',
  showMySessions: false,
  showWorkspacesTable: false,
  showUsersTable: false,
  showLeftSidebar: true,
  showRightSidebar: true,
  sessionsViewMode: 'grid' as const,
  showAppStoreHero: true,
  hasSeenGettingStartedTour: false
}

export const useUserPreferences = create<UserPreferencesState>()(
  persist(
    (set) => ({
      // Workspace filters
      workspaceFilters: defaultPreferences.workspaceFilters,
      setWorkspaceFilter: (key, value) =>
        set((state) => ({
          workspaceFilters: { ...state.workspaceFilters, [key]: value }
        })),

      // Search queries
      workspaceSearchQuery: defaultPreferences.workspaceSearchQuery,
      setWorkspaceSearchQuery: (query) => set({ workspaceSearchQuery: query }),
      sessionSearchQuery: defaultPreferences.sessionSearchQuery,
      setSessionSearchQuery: (query) => set({ sessionSearchQuery: query }),

      // Session filters
      showMySessions: defaultPreferences.showMySessions,
      setShowMySessions: (value) => set({ showMySessions: value }),

      // View preferences
      showWorkspacesTable: defaultPreferences.showWorkspacesTable,
      toggleWorkspaceView: () =>
        set((state) => ({ showWorkspacesTable: !state.showWorkspacesTable })),
      showUsersTable: defaultPreferences.showUsersTable,
      toggleUsersView: () =>
        set((state) => ({ showUsersTable: !state.showUsersTable })),

      // Left sidebar
      showLeftSidebar: defaultPreferences.showLeftSidebar,
      toggleLeftSidebar: () =>
        set((state) => ({ showLeftSidebar: !state.showLeftSidebar })),

      // Right sidebar
      showRightSidebar: defaultPreferences.showRightSidebar,
      toggleRightSidebar: () =>
        set((state) => ({ showRightSidebar: !state.showRightSidebar })),

      // Sessions view mode
      sessionsViewMode: defaultPreferences.sessionsViewMode,
      setSessionsViewMode: (mode) => set({ sessionsViewMode: mode }),

      // App Store hero
      showAppStoreHero: defaultPreferences.showAppStoreHero,
      toggleAppStoreHero: () =>
        set((state) => ({ showAppStoreHero: !state.showAppStoreHero })),

      // Getting started tour
      hasSeenGettingStartedTour: defaultPreferences.hasSeenGettingStartedTour,
      setHasSeenGettingStartedTour: (value) =>
        set({ hasSeenGettingStartedTour: value }),

      // Reset all preferences
      resetPreferences: () => set(defaultPreferences)
    }),
    {
      name: 'user-preferences' // localStorage key
    }
  )
)
