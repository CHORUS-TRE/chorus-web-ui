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

import { toast } from '@/components/hooks/use-toast'
import { App, AppInstance, User, Workbench, Workspace } from '@/domain/model'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
import { getGlobalEntry } from '@/view-model/dev-store-view-model'
import { listUsers } from '@/view-model/user-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceList } from '@/view-model/workspace-view-model'

import { useAuthentication } from './authentication-provider'

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
  customLogos: { light: string | null; dark: string | null }
  refreshCustomLogos: () => Promise<void>
  customTheme: {
    light: { primary: string; secondary: string; accent: string }
    dark: { primary: string; secondary: string; accent: string }
  }
  refreshCustomTheme: () => Promise<void>
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
  setHasSeenGettingStartedTour: () => {},
  customLogos: { light: null, dark: null },
  refreshCustomLogos: async () => {},
  customTheme: {
    light: { primary: '', secondary: '', accent: '' },
    dark: { primary: '', secondary: '', accent: '' }
  },
  refreshCustomTheme: async () => {}
})

export const AppStateProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const { user } = useAuthentication()
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
  const [customLogos, setCustomLogos] = useState<{
    light: string | null
    dark: string | null
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customLogos')
      return saved !== null ? JSON.parse(saved) : { light: null, dark: null }
    }
    return { light: null, dark: null }
  })
  const [customTheme, setCustomTheme] = useState<{
    light: { primary: string; secondary: string; accent: string }
    dark: { primary: string; secondary: string; accent: string }
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customTheme')
      return saved
        ? JSON.parse(saved)
        : {
            light: { primary: '', secondary: '', accent: '' },
            dark: { primary: '', secondary: '', accent: '' }
          }
    }
    return {
      light: { primary: '', secondary: '', accent: '' },
      dark: { primary: '', secondary: '', accent: '' }
    }
  })
  const [showAppStoreHero, setShowAppStoreHero] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showAppStoreHero')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const refreshCustomLogos = useCallback(async () => {
    try {
      const result = await getGlobalEntry('custom_logos')

      let logos = { light: null, dark: null }
      if (result.data?.value) {
        try {
          logos = JSON.parse(result.data.value)
        } catch (e) {
          console.error('Failed to parse custom_logos', e)
          toast({
            title: 'Error parsing custom logos',
            description: 'The saved logos data is invalid.',
            variant: 'destructive'
          })
        }
      }

      setCustomLogos(logos)
      localStorage.setItem('customLogos', JSON.stringify(logos))
    } catch (error) {
      toast({
        title: 'Error fetching custom logos',
        variant: 'destructive'
      })
    }
  }, [])

  const refreshCustomTheme = useCallback(async () => {
    try {
      const result = await getGlobalEntry('custom_theme')

      let newTheme = {
        light: { primary: '', secondary: '', accent: '' },
        dark: { primary: '', secondary: '', accent: '' }
      }

      if (result.data?.value) {
        try {
          newTheme = JSON.parse(result.data.value)
        } catch (e) {
          console.error('Failed to parse custom_theme', e)
          toast({
            title: 'Error parsing custom theme',
            description: 'The saved theme data is invalid.',
            variant: 'destructive'
          })
        }
      }

      setCustomTheme(newTheme)
      localStorage.setItem('customTheme', JSON.stringify(newTheme))
    } catch (error) {
      toast({
        title: 'Error fetching custom theme',
        variant: 'destructive'
      })
    }
  }, [])

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
        setWorkspaces(
          response.data.map((workspace) => ({
            ...workspace,
            PI: users?.find((user) => user.id === workspace.userId)?.username,
            memberCount:
              users?.filter((user) =>
                user.rolesWithContext?.some(
                  (role) => role.context.workspace === workspace.id
                )
              ).length || 0,
            workbenchCount:
              workbenches?.filter(
                (workbench) => workbench.workspaceId === workspace.id
              ).length || 0,
            files: workspace.files || 0
          }))
        )
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
      if (response?.error) {
        toast({ title: response.error, variant: 'destructive' })
      }
      if (!response?.data) {
        return
      }
      // Sort app instances by createdAt in descending order
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

  useEffect(() => {
    localStorage.setItem('customLogos', JSON.stringify(customLogos))
  }, [customLogos])

  useEffect(() => {
    localStorage.setItem('customTheme', JSON.stringify(customTheme))
  }, [customTheme])

  const initializeState = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const promises = [
        refreshWorkspaces(),
        refreshWorkbenches(),
        refreshUsers(),
        refreshApps(),
        refreshAppInstances()
      ]

      if (!customLogos.light && !customLogos.dark) {
        promises.push(refreshCustomLogos())
      }

      if (
        !customTheme.light.primary &&
        !customTheme.light.secondary &&
        !customTheme.light.accent &&
        !customTheme.dark.primary &&
        !customTheme.dark.secondary &&
        !customTheme.dark.accent
      ) {
        promises.push(refreshCustomTheme())
      }

      await Promise.all(promises)
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
    refreshAppInstances,
    refreshCustomLogos,
    refreshCustomTheme
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
      setHasSeenGettingStartedTour,
      customLogos,
      refreshCustomLogos,
      customTheme,
      refreshCustomTheme
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
      setHasSeenGettingStartedTour,
      customLogos,
      refreshCustomLogos,
      customTheme,
      refreshCustomTheme
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
