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
  useMemo,
  useState
} from 'react'

import { App, AppInstance, User, Workbench, Workspace } from '@/domain/model'

import { listAppInstances } from '../actions/app-instance-view-model'
import { appList } from '../actions/app-view-model'
import { listUsers } from '../actions/user-view-model'
import { workbenchList } from '../actions/workbench-view-model'
import { workspaceList } from '../actions/workspace-view-model'
import { toast } from '../hooks/use-toast'
import { useAuth } from './auth-context'

type AppStateContextType = {
  showRightSidebar: boolean
  toggleRightSidebar: () => void
  showWorkspacesTable: boolean
  toggleWorkspaceView: () => void
  background:
    | {
        sessionId?: string
        workspaceId: string
      }
    | undefined
  setBackground: Dispatch<
    SetStateAction<
      | {
          sessionId?: string
          workspaceId: string
        }
      | undefined
    >
  >
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  users: User[] | undefined
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
  users: undefined,
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
    sessionId?: string
    workspaceId: string
  }>()
  const [workspaces, setWorkspaces] = useState<Workspace[] | undefined>(
    undefined
  )
  const [workbenches, setWorkbenches] = useState<Workbench[] | undefined>(
    undefined
  )
  const [users, setUsers] = useState<User[] | undefined>(undefined)
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

  const toggleRightSidebar = useCallback(() => {
    setShowRightSidebar((prev) => !prev)
  }, [])

  const toggleWorkspaceView = useCallback(() => {
    setShowWorkspacesTable((prev) => !prev)
  }, [])

  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const response = await workspaceList()
      if (response?.error)
        toast({ title: response.error, variant: 'destructive' })
      if (response?.data) {
        setWorkspaces(response.data)
      }
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
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
            (a, b) =>
              (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
          ) as Workbench[]
        )
      if (response?.error)
        toast({ title: response.error, variant: 'destructive' })
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
    }
  }, [user])

  const refreshUsers = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await listUsers()

      if (response?.error) {
        // toast({ title: response.error, variant: 'destructive' })
      }

      if (response?.data) {
        setUsers(response.data)
      }
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
    }
  }, [user])

  const refreshApps = useCallback(async () => {
    if (!user) {
      return
    }

    const result = await appList()

    if (result?.error) toast({ title: result.error, variant: 'destructive' })

    if (result?.data) {
      setApps(
        result.data.sort((a, b) => {
          if (!a.name || !b.name) return 0
          return a.name.localeCompare(b.name)
        })
      )
    }
  }, [user])

  const refreshAppInstances = useCallback(async () => {
    if (!user) {
      return
    }
    try {
      const response = await listAppInstances()
      setAppInstances(
        response.data?.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      )
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
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
    setUsers(undefined)
    setBackground(undefined)
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
      await refreshUsers()
      await refreshApps()
      await refreshAppInstances()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
      console.error(error)
    }
  }, [
    user,
    refreshWorkspaces,
    refreshWorkbenches,
    refreshUsers,
    refreshApps,
    refreshAppInstances
  ])

  useEffect(() => {
    initializeState()
  }, [initializeState])

  const contextValue = useMemo(
    () => ({
      showRightSidebar,
      toggleRightSidebar,
      showWorkspacesTable,
      toggleWorkspaceView,
      background,
      setBackground,
      workspaces,
      workbenches,
      users,
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
    }),
    [
      showRightSidebar,
      toggleRightSidebar,
      showWorkspacesTable,
      toggleWorkspaceView,
      background,
      setBackground,
      workspaces,
      workbenches,
      users,
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
    ]
  )

  return (
    <AppStateContext.Provider value={contextValue}>
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
