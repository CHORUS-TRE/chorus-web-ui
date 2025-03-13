'use client'

import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { App, AppInstance, Workbench, Workspace } from '@/domain/model'

import { appInstanceList } from '../actions/app-instance-view-model'
import { appList } from '../actions/app-view-model'
import { workbenchList } from '../actions/workbench-view-model'
import { workspaceList } from '../actions/workspace-view-model'

import { useAuth } from './auth-context'

type AppStateContextType = {
  showRightSidebar: boolean
  toggleRightSidebar: () => void
  showWorkspacesTable: boolean
  toggleWorkspaceView: () => void
  background:
    | {
        workbenchId: string
        workspaceId: string
      }
    | undefined
  setBackground: Dispatch<
    SetStateAction<
      | {
          workbenchId: string
          workspaceId: string
        }
      | undefined
    >
  >
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  error: string | undefined
  setError: Dispatch<SetStateAction<string | undefined>>
  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  clearState: () => void
  apps: App[] | undefined
  refreshApps: () => Promise<void>
  appInstances: AppInstance[] | undefined
  refreshAppInstances: () => Promise<void>
  showAppStoreHero: boolean
  toggleAppStoreHero: () => void
  hasSeenGettingStartedTour: boolean
  setHasSeenGettingStartedTour: Dispatch<SetStateAction<boolean>>
}

const AppStateContext = createContext<AppStateContextType>({
  showRightSidebar: false,
  toggleRightSidebar: () => {},
  showWorkspacesTable: true,
  toggleWorkspaceView: () => {},
  background: undefined,
  setBackground: () => {},
  workspaces: undefined,
  workbenches: undefined,
  error: undefined,
  setError: () => {},
  refreshWorkspaces: async () => {},
  refreshWorkbenches: async () => {},
  clearState: () => {},
  apps: undefined,
  refreshApps: async () => {},
  appInstances: undefined,
  refreshAppInstances: async () => {},
  showAppStoreHero: true,
  toggleAppStoreHero: () => {},
  hasSeenGettingStartedTour: false,
  setHasSeenGettingStartedTour: () => {}
})

export const AppStateProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const { user } = useAuth()
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showRightSidebar')

      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const [showWorkspacesTable, setShowWorkspacesTable] = useState(false)
  const [background, setBackground] = useState<{
    workbenchId: string
    workspaceId: string
  }>()
  const [workspaces, setWorkspaces] = useState<Workspace[] | undefined>(
    undefined
  )
  const [workbenches, setWorkbenches] = useState<Workbench[] | undefined>(
    undefined
  )
  const [error, setError] = useState<string | undefined>(undefined)
  const [apps, setApps] = useState<App[] | undefined>(undefined)
  const [appInstances, setAppInstances] = useState<AppInstance[] | undefined>(
    undefined
  )
  const [showAppStoreHero, setShowAppStoreHero] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showAppStoreHero')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const toggleAppStoreHero = useCallback(() => {
    setShowAppStoreHero((prev) => !prev)
  }, [])

  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const response = await workspaceList()
      if (response?.error) setError(response.error)
      if (response?.data)
        setWorkspaces(
          response.data
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .sort((a) => (a.id === user?.workspaceId ? -1 : 0))
        )
    } catch (error) {
      setError(error.message)
    }
  }, [user])

  const refreshWorkbenches = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const response = await workbenchList()
      if (response?.data)
        setWorkbenches(
          response.data.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        )
      if (response?.error) setError(response.error)
    } catch (error) {
      setError(error.message)
    }
  }, [user])

  const refreshApps = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const response = await appList()
      if (response?.error) setError(response.error)
      if (response?.data) {
        setApps(
          response.data.sort((a, b) => {
            if (!a.name || !b.name) return 0
            return a.name.localeCompare(b.name)
          })
        )
      }
    } catch (error) {
      setError(error.message)
    }
  }, [user])

  const refreshAppInstances = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await appInstanceList()
      setAppInstances(
        response.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      )
    } catch (error) {
      setError(error.message)
    }
  }, [user])

  const [hasSeenGettingStartedTour, setHasSeenGettingStartedTour] =
    useState<boolean>(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('hasSeenGettingStartedTour')
        const state = saved !== null ? JSON.parse(saved) : false

        return state
      }

      return false
    })

  const clearState = useCallback(() => {
    setWorkspaces(undefined)
    setWorkbenches(undefined)
    setBackground(undefined)
    setError(undefined)
    setApps(undefined)
    setAppInstances(undefined)
    setShowAppStoreHero(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('showAppStoreHero', JSON.stringify(showAppStoreHero))
  }, [showAppStoreHero])

  useEffect(() => {
    localStorage.setItem('showRightSidebar', JSON.stringify(showRightSidebar))
  }, [showRightSidebar])

  useEffect(() => {
    localStorage.setItem(
      'hasSeenGettingStartedTour',
      JSON.stringify(hasSeenGettingStartedTour)
    )
  }, [hasSeenGettingStartedTour])

  const initializeState = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      await refreshWorkspaces()
      await refreshWorkbenches()
      await refreshApps()
      await refreshAppInstances()
    } catch (error) {
      console.error(error)
    }
  }, [
    user,
    refreshWorkspaces,
    refreshWorkbenches,
    refreshApps,
    refreshAppInstances
  ])

  useEffect(() => {
    initializeState()
  }, [initializeState])

  return (
    <AppStateContext.Provider
      value={{
        showRightSidebar,
        toggleRightSidebar: () => setShowRightSidebar(!showRightSidebar),
        showWorkspacesTable,
        toggleWorkspaceView: () => setShowWorkspacesTable(!showWorkspacesTable),
        background,
        setBackground,
        workspaces,
        workbenches,
        error,
        setError,
        refreshWorkspaces,
        refreshWorkbenches,
        clearState,
        apps,
        refreshApps,
        appInstances,
        refreshAppInstances,
        showAppStoreHero,
        toggleAppStoreHero,
        hasSeenGettingStartedTour,
        setHasSeenGettingStartedTour
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
