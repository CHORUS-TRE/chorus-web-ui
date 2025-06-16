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

import { App, AppInstance, User, Workbench, Workspace } from '@/domain/model'

import { appInstanceList } from '../actions/app-instance-view-model'
import { appList } from '../actions/app-view-model'
import { userList } from '../actions/user-view-model'
import { workbenchList } from '../actions/workbench-view-model'
import { workspaceList } from '../actions/workspace-view-model'
import { useAuth } from './auth-context'

type NotificationType =
  | {
      title: string
      description?: string
      variant?: 'default' | 'destructive'
      action?: {
        label: string
        onClick: () => void
      }
    }
  | undefined

type AppStateContextType = {
  showRightSidebar: boolean
  toggleRightSidebar: () => void
  sideBarContent: ReactNode | undefined
  setSideBarContent: Dispatch<SetStateAction<ReactNode>>
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
  notification: NotificationType
  setNotification: Dispatch<SetStateAction<NotificationType>>
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
  setSideBarContent: () => {},
  sideBarContent: undefined,
  showWorkspacesTable: true,
  toggleWorkspaceView: () => {},
  background: undefined,
  setBackground: () => {},
  workspaces: undefined,
  workbenches: undefined,
  users: undefined,
  notification: undefined,
  setNotification: () => {},
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
  const [sideBarContent, setSideBarContent] = useState<ReactNode | undefined>(
    undefined
  )
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
  const [notification, setNotification] = useState<NotificationType>(undefined)
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
      if (response?.error)
        setNotification({ title: response.error, variant: 'destructive' })
      if (response?.data)
        setWorkspaces(
          response.data
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .sort((a) => (a.id === user?.workspaceId ? -1 : 0))
        )
    } catch (error) {
      setNotification({
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
        setNotification({ title: response.error, variant: 'destructive' })
    } catch (error) {
      setNotification({
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
      const response = await userList()

      if (response?.error) {
        setNotification({ title: response.error, variant: 'destructive' })
      }

      if (response?.data) {
        setUsers(response.data)
      }
    } catch (error) {
      setNotification({
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
    console.log('result', result)
    if (result?.error)
      setNotification({ title: result.error, variant: 'destructive' })

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
      const response = await appInstanceList()
      setAppInstances(
        response.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      )
    } catch (error) {
      setNotification({
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
    setNotification(undefined)
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
      // setNotification({
      //   title: 'Error',
      //   description: 'User not found',
      //   variant: 'destructive'
      // })
      return
    }

    try {
      await refreshWorkspaces()
      await refreshWorkbenches()
      await refreshUsers()
      await refreshApps()
      await refreshAppInstances()
    } catch (error) {
      setNotification({
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

  return (
    <AppStateContext.Provider
      value={{
        showRightSidebar,
        toggleRightSidebar: () => setShowRightSidebar(!showRightSidebar),
        sideBarContent,
        setSideBarContent,
        showWorkspacesTable,
        toggleWorkspaceView: () => setShowWorkspacesTable(!showWorkspacesTable),
        background,
        setBackground,
        workspaces,
        workbenches,
        users,
        notification,
        setNotification,
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
