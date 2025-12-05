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

  // View preferences
  showWorkspacesTable: boolean
  toggleWorkspaceView: () => void

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
    showMyWorkspaces: false,
    showCenter: false,
    showProject: true
  },
  showWorkspacesTable: false,
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

      // View preferences
      showWorkspacesTable: defaultPreferences.showWorkspacesTable,
      toggleWorkspaceView: () =>
        set((state) => ({ showWorkspacesTable: !state.showWorkspacesTable })),

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
