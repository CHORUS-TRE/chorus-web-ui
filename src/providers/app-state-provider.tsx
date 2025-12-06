'use client'

import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { toast } from '@/components/hooks/use-toast'
import { App, AppInstance, User, Workbench, Workspace } from '@/domain/model'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { listAppInstances } from '@/view-model/app-instance-view-model'
import { appList } from '@/view-model/app-view-model'
import { listUsers } from '@/view-model/user-view-model'
import { workbenchList } from '@/view-model/workbench-view-model'
import { workspaceList } from '@/view-model/workspace-view-model'

import { useAuthentication } from './authentication-provider'

type AppStateContextType = {
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  refreshWorkspaces: () => Promise<void>
  refreshWorkbenches: () => Promise<void>
  clearState: () => void
  apps: App[] | undefined
  refreshApps: () => Promise<void>
  appInstances: AppInstance[] | undefined
  refreshAppInstances: () => Promise<void>
}

const AppStateContext = createContext<AppStateContextType>({
  workspaces: undefined,
  workbenches: undefined,
  refreshWorkspaces: async () => {},
  refreshWorkbenches: async () => {},
  clearState: () => {},
  apps: undefined,
  refreshApps: async () => {},
  appInstances: undefined,
  refreshAppInstances: async () => {}
})

export const AppStateProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const { user } = useAuthentication()
  const [workspaces, setWorkspaces] = useState<Workspace[] | undefined>(
    undefined
  )
  const [workbenches, setWorkbenches] = useState<Workbench[] | undefined>(
    undefined
  )
  const [apps, setApps] = useState<App[] | undefined>(undefined)
  const [appInstances, setAppInstances] = useState<AppInstance[] | undefined>(
    undefined
  )

  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      // Fetch workspaces and workbenches in parallel to avoid race condition
      const [workspaceResponse, workbenchResponse] = await Promise.all([
        workspaceList(),
        workbenchList()
      ])

      if (workspaceResponse?.error)
        toast({ title: workspaceResponse.error, variant: 'destructive' })

      if (workspaceResponse?.data) {
        const sortedWorkspaces = workspaceResponse.data.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        )

        // Use fetched workbenches for count calculation (not stale state)
        const fetchedWorkbenches = workbenchResponse?.data || []

        // Batch load all workspace entries (fixes N+1 problem)
        const { loadWorkspaces, getWorkspace } = useDevStoreCache.getState()
        await loadWorkspaces(sortedWorkspaces.map((ws) => ws.id))

        const enrichedWorkspaces = await Promise.all(
          sortedWorkspaces.map(async (workspace) => {
            // Sync lookup from cache (no API calls)
            const image = getWorkspace(workspace.id, 'image')
            const tagValue = getWorkspace(workspace.id, 'tag')
            const tag: 'center' | 'project' =
              (tagValue as 'center' | 'project') || 'project'

            const result = await listUsers({
              filterWorkspaceIDs: [workspace.id]
            })

            let users: User[] | undefined = []
            if (result.data) {
              users = result.data
            }

            let owner: User | undefined = undefined
            if (users) {
              owner = users.find((user) => user.id === workspace.userId)
            }

            return {
              ...workspace,
              image,
              tag,
              owner: owner ? `${owner.firstName} ${owner.lastName}` : undefined,
              memberCount: users?.length || 0,
              members: users,
              workbenchCount: fetchedWorkbenches.filter(
                  (workbench) => workbench.workspaceId === workspace.id
              ).length,
              files: workspace.files || 0
            }
          })
        )
        setWorkspaces(enrichedWorkspaces)
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

  // const refreshUsers = useCallback(async () => {
  //   if (!user) {
  //     return
  //   }
  //   try {
  //     const response = await listUsers()

  //     if (response?.error) {
  //       // toast({ title: response.error, variant: 'destructive' })
  //     }

  //     if (response?.data) {
  //       setUsers(response.data)
  //     }
  //   } catch (error) {
  //     toast({
  //       title: error instanceof Error ? error.message : String(error),
  //       variant: 'destructive'
  //     })
  //   }
  // }, [user])

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

  const clearState = useCallback(() => {
    setWorkspaces(undefined)
    setWorkbenches(undefined)
    setApps(undefined)
    setAppInstances(undefined)

    // Clear user-specific data from dev store cache
    const { clearUserData } = useDevStoreCache.getState()
    clearUserData()
  }, [])

  const initializeState = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      // Initialize dev store caches first
      const { initGlobal, initUser } = useDevStoreCache.getState()
      await initGlobal()
      await initUser()

      // Then load other data in parallel
      await Promise.all([
        refreshWorkspaces(),
        refreshWorkbenches(),
        // refreshUsers(),
        refreshApps(),
        refreshAppInstances()
      ])
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
    // refreshUsers,
    refreshApps,
    refreshAppInstances
  ])

  useEffect(() => {
    initializeState()
  }, [initializeState])

  const contextValue = useMemo(
    () => ({
      workspaces,
      workbenches,
      refreshWorkspaces,
      refreshWorkbenches,
      clearState,
      apps,
      refreshApps,
      appInstances,
      refreshAppInstances
    }),
    [
      workspaces,
      workbenches,
      refreshWorkspaces,
      refreshWorkbenches,
      clearState,
      apps,
      refreshApps,
      appInstances,
      refreshAppInstances
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
