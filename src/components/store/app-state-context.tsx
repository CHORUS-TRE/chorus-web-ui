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
import { workspaceGet, workspaceList } from '../actions/workspace-view-model'

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
  setWorkspaces: Dispatch<SetStateAction<Workspace[] | undefined>>
  workbenches: Workbench[] | undefined
  setWorkbenches: Dispatch<SetStateAction<Workbench[] | undefined>>
  error: string | undefined
  setError: Dispatch<SetStateAction<string | undefined>>
  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  clearState: () => void
  apps: App[] | undefined
  setApps: Dispatch<SetStateAction<App[] | undefined>>
  refreshApps: () => Promise<void>
  appInstances: AppInstance[] | undefined
  setAppInstances: Dispatch<SetStateAction<AppInstance[] | undefined>>
  refreshAppInstances: () => Promise<void>
  showAppStoreHero: boolean
  toggleAppStoreHero: () => void
}

const AppStateContext = createContext<AppStateContextType>({
  showRightSidebar: false,
  toggleRightSidebar: () => {},
  showWorkspacesTable: true,
  toggleWorkspaceView: () => {},
  background: undefined,
  setBackground: () => {},
  workspaces: undefined,
  setWorkspaces: () => {},
  workbenches: undefined,
  setWorkbenches: () => {},
  error: undefined,
  setError: () => {},
  refreshWorkspaces: async () => {},
  refreshWorkbenches: async () => {},
  clearState: () => {},
  apps: undefined,
  setApps: () => {},
  refreshApps: async () => {},
  appInstances: undefined,
  setAppInstances: () => {},
  refreshAppInstances: async () => {},
  showAppStoreHero: true,
  toggleAppStoreHero: () => {}
})

export const AppStateProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [showRightSidebar, setShowRightSidebar] = useState(false)
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
  const [userWorkspaceId, setUserWorkspaceId] = useState<string | undefined>(
    undefined
  )
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    localStorage.setItem('showAppStoreHero', JSON.stringify(showAppStoreHero))
  }, [showAppStoreHero])

  const toggleAppStoreHero = useCallback(() => {
    setShowAppStoreHero((prev) => !prev)
  }, [])

  const refreshWorkspaces = useCallback(async () => {
    try {
      const response = await workspaceList()
      if (response?.error) setError(response.error)
      if (response?.data)
        setWorkspaces(
          response.data.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        )
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const refreshWorkbenches = useCallback(async () => {
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
  }, [])

  const refreshApps = useCallback(async () => {
    try {
      const response = await appList()
      if (response?.error) setError(response.error)
      if (response?.data) {
        setApps(
          response.data.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        )
      }
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const refreshAppInstances = useCallback(async () => {
    try {
      const response = await appInstanceList()
      setAppInstances(
        response.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      )
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const clearState = useCallback(() => {
    setWorkspaces(undefined)
    setWorkbenches(undefined)
    setBackground(undefined)
    setError(undefined)
    setApps(undefined)
    setAppInstances(undefined)
    setShowAppStoreHero(true)
    localStorage.removeItem('showAppStoreHero')
    setUserWorkspaceId(undefined)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      clearState()
      return
    }

    const initializeState = async () => {
      try {
        await refreshWorkspaces()
        await refreshWorkbenches()
        await refreshApps()
        await refreshAppInstances()
        const userWorkspaceId =
          process.env.NEXT_PUBLIC_ALBERT_WORKSPACE_ID ||
          (await user?.workspaceId)
        setUserWorkspaceId(userWorkspaceId)
      } catch (error) {
        console.error(error)
      }
    }

    initializeState()
  }, [isAuthenticated, user?.workspaceId])

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
        setWorkspaces,
        workbenches,
        setWorkbenches,
        error,
        setError,
        refreshWorkspaces,
        refreshWorkbenches,
        clearState,
        apps,
        setApps,
        refreshApps,
        appInstances,
        setAppInstances,
        refreshAppInstances,
        showAppStoreHero,
        toggleAppStoreHero
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
