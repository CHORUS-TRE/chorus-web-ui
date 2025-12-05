'use client'

import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { toast } from '@/components/hooks/use-toast'
import {
  CachedIframe,
  ExternalWebApp,
  ExternalWebAppsArraySchema
} from '@/domain/model'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { workbenchStreamUrl } from '@/view-model/workbench-view-model'

import { useAuthentication } from './authentication-provider'

const MAX_CACHED_IFRAMES = 10
const MAX_RECENT_ITEMS = 10
const DEVSTORE_KEY_EXTERNAL_WEBAPPS = 'external_webapps'
const LOCALSTORAGE_KEY_RECENT_SESSIONS = 'chorus_recent_sessions'
const LOCALSTORAGE_KEY_RECENT_WEBAPPS = 'chorus_recent_webapps'

// Type for persisted recent items (sessions/webapps that were opened)
export type RecentSession = {
  id: string
  workspaceId: string
  name: string
  lastAccessed: string // ISO date string for JSON serialization
}

export type RecentWebApp = {
  id: string
  name: string
  lastAccessed: string
}

type IframeCacheContextType = {
  // Cache state (in-memory loaded iframes)
  cachedIframes: Map<string, CachedIframe>
  activeIframeId: string | null

  // Recent items (persisted, may or may not be loaded)
  recentSessions: RecentSession[]
  recentWebApps: RecentWebApp[]

  // Actions
  openSession: (
    sessionId: string,
    workspaceId: string,
    name?: string
  ) => Promise<void>
  openWebApp: (webappId: string) => void
  closeIframe: (id: string) => void
  setActiveIframe: (id: string | null) => void
  clearAllCache: () => void
  removeFromRecent: (id: string, type: 'session' | 'webapp') => void

  // Memory management
  getCacheCount: () => number
  showCleanupDialog: boolean
  setShowCleanupDialog: (show: boolean) => void

  // services config (from DevStore)
  externalWebApps: ExternalWebApp[]
  refreshExternalWebApps: () => void
  addExternalWebApp: (webapp: ExternalWebApp) => Promise<boolean>
  updateExternalWebApp: (webapp: ExternalWebApp) => Promise<boolean>
  removeExternalWebApp: (webappId: string) => Promise<boolean>

  // For backward compatibility during migration
  background:
    | {
        sessionId?: string
        workspaceId: string
      }
    | undefined
}

const IframeCacheContext = createContext<IframeCacheContextType>({
  cachedIframes: new Map(),
  activeIframeId: null,
  recentSessions: [],
  recentWebApps: [],
  openSession: async () => {},
  openWebApp: () => {},
  closeIframe: () => {},
  setActiveIframe: () => {},
  clearAllCache: () => {},
  removeFromRecent: () => {},
  getCacheCount: () => 0,
  showCleanupDialog: false,
  setShowCleanupDialog: () => {},
  externalWebApps: [],
  refreshExternalWebApps: () => {},
  addExternalWebApp: async () => false,
  updateExternalWebApp: async () => false,
  removeExternalWebApp: async () => false,
  background: undefined
})

// Helper to load recent sessions from localStorage
function loadRecentSessions(): RecentSession[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY_RECENT_SESSIONS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to load recent webapps from localStorage
function loadRecentWebApps(): RecentWebApp[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY_RECENT_WEBAPPS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to save recent sessions to localStorage
function saveRecentSessions(sessions: RecentSession[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      LOCALSTORAGE_KEY_RECENT_SESSIONS,
      JSON.stringify(sessions.slice(0, MAX_RECENT_ITEMS))
    )
  } catch {
    // Ignore storage errors
  }
}

// Helper to save recent webapps to localStorage
function saveRecentWebApps(webapps: RecentWebApp[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      LOCALSTORAGE_KEY_RECENT_WEBAPPS,
      JSON.stringify(webapps.slice(0, MAX_RECENT_ITEMS))
    )
  } catch {
    // Ignore storage errors
  }
}

export const IframeCacheProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const { user } = useAuthentication()

  // Use a ref to store the Map to avoid re-renders on every update
  const cacheRef = useRef<Map<string, CachedIframe>>(new Map())
  // State to trigger re-renders when cache changes
  const [cacheVersion, setCacheVersion] = useState(0)
  const [activeIframeId, setActiveIframeIdState] = useState<string | null>(null)
  const [externalWebApps, setExternalWebApps] = useState<ExternalWebApp[]>([])
  // Track loading state and pending requests to handle race conditions
  const [externalWebAppsLoaded, setExternalWebAppsLoaded] = useState(false)
  const pendingWebAppOpenRef = useRef<string[]>([])

  // Recent sessions and webapps (persisted to localStorage)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [recentWebApps, setRecentWebApps] = useState<RecentWebApp[]>([])

  // Load recent items from localStorage on mount
  useEffect(() => {
    setRecentSessions(loadRecentSessions())
    setRecentWebApps(loadRecentWebApps())
  }, [])
  const [showCleanupDialog, setShowCleanupDialog] = useState(false)

  // Track previous user to detect logout
  const prevUserRef = useRef<typeof user>(user)

  // Helper to trigger re-render
  const updateCache = useCallback(() => {
    setCacheVersion((v) => v + 1)
  }, [])

  // Load external services from DevStore cache
  const refreshExternalWebApps = useCallback(() => {
    const { getGlobal, isGlobalLoaded } = useDevStoreCache.getState()

    if (!isGlobalLoaded) {
      // Cache not yet loaded, will be called again when ready
      return
    }

    const value = getGlobal(DEVSTORE_KEY_EXTERNAL_WEBAPPS)
    if (value) {
      try {
        const parsed = JSON.parse(value)
        const validated = ExternalWebAppsArraySchema.safeParse(parsed)

        if (validated.success) {
          setExternalWebApps(validated.data)
        } else {
          console.error(
            'Invalid external webapps data:',
            validated.error.issues
          )
        }
      } catch (e) {
        console.error('Failed to parse external webapps JSON:', e)
      }
    }
    setExternalWebAppsLoaded(true)
  }, [])

  // Subscribe to global cache loaded state and refresh when ready
  const isGlobalLoaded = useDevStoreCache((state) => state.isGlobalLoaded)

  useEffect(() => {
    if (isGlobalLoaded) {
      refreshExternalWebApps()
    }
  }, [isGlobalLoaded, refreshExternalWebApps])

  // Add a webapp to recent list
  // Maintains order by first load time (doesn't move existing webapps to front)
  const addToRecentWebApps = useCallback(
    (webappId: string, webappName: string) => {
      setRecentWebApps((prev) => {
        // Check if webapp already exists in the list
        const existingIndex = prev.findIndex((w) => w.id === webappId)

        if (existingIndex !== -1) {
          // Webapp already exists - update lastAccessed but keep original position
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            name: webappName, // Update name in case it changed
            lastAccessed: new Date().toISOString()
          }
          saveRecentWebApps(updated)
          return updated
        } else {
          // New webapp - add to the end (maintains chronological order)
          const newRecent: RecentWebApp = {
            id: webappId,
            name: webappName,
            lastAccessed: new Date().toISOString()
          }
          const updated = [...prev, newRecent].slice(-MAX_RECENT_ITEMS)
          saveRecentWebApps(updated)
          return updated
        }
      })
    },
    []
  )

  // Process any pending webapp open requests after externalWebApps are loaded
  useEffect(() => {
    if (externalWebAppsLoaded && pendingWebAppOpenRef.current.length > 0) {
      const pendingIds = [...pendingWebAppOpenRef.current]
      pendingWebAppOpenRef.current = []

      // Process each pending webapp open request
      pendingIds.forEach((webappId) => {
        const webapp = externalWebApps.find((app) => app.id === webappId)
        if (webapp) {
          // Add to cache
          const newIframe: CachedIframe = {
            id: webappId,
            type: 'webapp',
            url: webapp.url,
            name: webapp.name,
            lastAccessed: new Date()
          }
          cacheRef.current.set(webappId, newIframe)
          setActiveIframeIdState(webappId)
          setCacheVersion((v) => v + 1)
          // Add to recent webapps (handles both new and existing)
          addToRecentWebApps(webappId, webapp.name)
        } else {
          toast({
            title: 'Error opening web app',
            description: 'Web app not found',
            variant: 'destructive'
          })
        }
      })
    }
  }, [externalWebAppsLoaded, externalWebApps, addToRecentWebApps])

  // Save external services to DevStore cache
  const saveExternalWebApps = useCallback(
    async (webapps: ExternalWebApp[]): Promise<boolean> => {
      try {
        const { setGlobal } = useDevStoreCache.getState()
        const success = await setGlobal(
          DEVSTORE_KEY_EXTERNAL_WEBAPPS,
          JSON.stringify(webapps)
        )

        if (!success) {
          toast({
            title: 'Error saving services',
            description: 'Failed to save to backend',
            variant: 'destructive'
          })
          return false
        }

        setExternalWebApps(webapps)
        return true
      } catch (error) {
        toast({
          title: 'Error saving services',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive'
        })
        return false
      }
    },
    []
  )

  // Add a new external web app
  const addExternalWebApp = useCallback(
    async (webapp: ExternalWebApp): Promise<boolean> => {
      // Check for duplicate ID
      if (externalWebApps.some((app) => app.id === webapp.id)) {
        toast({
          title: 'Duplicate ID',
          description: 'A web app with this ID already exists',
          variant: 'destructive'
        })
        return false
      }

      const updatedApps = [...externalWebApps, webapp]
      const success = await saveExternalWebApps(updatedApps)

      if (success) {
        toast({
          title: 'Web app added',
          description: `${webapp.name} has been added successfully`
        })
      }

      return success
    },
    [externalWebApps, saveExternalWebApps]
  )

  // Update an existing external web app
  const updateExternalWebApp = useCallback(
    async (webapp: ExternalWebApp): Promise<boolean> => {
      const index = externalWebApps.findIndex((app) => app.id === webapp.id)
      if (index === -1) {
        toast({
          title: 'Web app not found',
          description: 'The web app you are trying to update does not exist',
          variant: 'destructive'
        })
        return false
      }

      const updatedApps = [...externalWebApps]
      updatedApps[index] = webapp
      const success = await saveExternalWebApps(updatedApps)

      if (success) {
        toast({
          title: 'Web app updated',
          description: `${webapp.name} has been updated successfully`
        })
      }

      return success
    },
    [externalWebApps, saveExternalWebApps]
  )

  // Remove an external web app
  const removeExternalWebApp = useCallback(
    async (webappId: string): Promise<boolean> => {
      const webapp = externalWebApps.find((app) => app.id === webappId)
      if (!webapp) {
        toast({
          title: 'Web app not found',
          description: 'The web app you are trying to remove does not exist',
          variant: 'destructive'
        })
        return false
      }

      // Also close the iframe if it's cached
      cacheRef.current.delete(webappId)
      if (activeIframeId === webappId) {
        setActiveIframeIdState(null)
      }
      setCacheVersion((v) => v + 1)

      const updatedApps = externalWebApps.filter((app) => app.id !== webappId)
      const success = await saveExternalWebApps(updatedApps)

      if (success) {
        toast({
          title: 'Web app removed',
          description: `${webapp.name} has been removed successfully`
        })
      }

      return success
    },
    [externalWebApps, saveExternalWebApps, activeIframeId]
  )

  // Clear cache on logout (when user becomes undefined)
  useEffect(() => {
    if (prevUserRef.current && !user) {
      // User logged out - clear all cached iframes
      cacheRef.current.clear()
      setActiveIframeIdState(null)
      setCacheVersion((v) => v + 1)
    }
    prevUserRef.current = user
  }, [user])

  // Check cache size and warn user
  const checkCacheSize = useCallback(() => {
    if (cacheRef.current.size >= MAX_CACHED_IFRAMES) {
      toast({
        title: 'Memory Warning',
        description: `You have ${cacheRef.current.size} sessions/apps open. Consider closing some to free memory.`,
        variant: 'default',
        action: (
          <button
            onClick={() => setShowCleanupDialog(true)}
            className="rounded bg-accent px-2 py-1 text-xs text-accent-foreground hover:bg-accent/90"
          >
            Manage
          </button>
        )
      })
    }
  }, [])

  // Add a session to recent list
  // Maintains order by first load time (doesn't move existing sessions to front)
  const addToRecentSessions = useCallback(
    (sessionId: string, workspaceId: string, sessionName: string) => {
      setRecentSessions((prev) => {
        // Check if session already exists in the list
        const existingIndex = prev.findIndex((s) => s.id === sessionId)

        if (existingIndex !== -1) {
          // Session already exists - update lastAccessed but keep original position
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            name: sessionName, // Update name in case it changed
            lastAccessed: new Date().toISOString()
          }
          saveRecentSessions(updated)
          return updated
        } else {
          // New session - add to the end (maintains chronological order)
          const newRecent: RecentSession = {
            id: sessionId,
            workspaceId,
            name: sessionName,
            lastAccessed: new Date().toISOString()
          }
          const updated = [...prev, newRecent].slice(-MAX_RECENT_ITEMS)
          saveRecentSessions(updated)
          return updated
        }
      })
    },
    []
  )

  // Remove from recent list
  const removeFromRecent = useCallback(
    (id: string, type: 'session' | 'webapp') => {
      if (type === 'session') {
        setRecentSessions((prev) => {
          const updated = prev.filter((s) => s.id !== id)
          saveRecentSessions(updated)
          return updated
        })
      } else {
        setRecentWebApps((prev) => {
          const updated = prev.filter((w) => w.id !== id)
          saveRecentWebApps(updated)
          return updated
        })
      }
    },
    []
  )

  // Open a session (workbench) iframe
  const openSession = useCallback(
    async (sessionId: string, workspaceId: string, name?: string) => {
      const sessionName = name || `Session ${sessionId}`

      // Check if already cached
      const existing = cacheRef.current.get(sessionId)
      if (existing) {
        // Update last accessed time
        cacheRef.current.set(sessionId, {
          ...existing,
          lastAccessed: new Date()
        })
        setActiveIframeIdState(sessionId)
        updateCache()
        // Update recent list
        addToRecentSessions(sessionId, workspaceId, existing.name)
        return
      }

      // Fetch the stream URL
      const result = await workbenchStreamUrl(sessionId)

      if (result.error || !result.data) {
        toast({
          title: 'Error opening session',
          description: result.error || 'Failed to get session URL',
          variant: 'destructive'
        })
        return
      }

      // Add to cache
      const newIframe: CachedIframe = {
        id: sessionId,
        type: 'session',
        url: result.data,
        name: sessionName,
        workspaceId,
        lastAccessed: new Date()
      }

      cacheRef.current.set(sessionId, newIframe)
      setActiveIframeIdState(sessionId)
      updateCache()
      checkCacheSize()

      // Add to recent list
      addToRecentSessions(sessionId, workspaceId, sessionName)
    },
    [updateCache, checkCacheSize, addToRecentSessions]
  )

  // Open a web app iframe
  const openWebApp = useCallback(
    (webappId: string) => {
      // Check if already cached
      const existing = cacheRef.current.get(webappId)
      if (existing) {
        // Update last accessed time
        cacheRef.current.set(webappId, {
          ...existing,
          lastAccessed: new Date()
        })
        setActiveIframeIdState(webappId)
        updateCache()
        // Update recent list
        addToRecentWebApps(webappId, existing.name)
        return
      }

      // If external webapps haven't loaded yet, queue the request
      if (!externalWebAppsLoaded) {
        if (!pendingWebAppOpenRef.current.includes(webappId)) {
          pendingWebAppOpenRef.current.push(webappId)
        }
        return
      }

      // Find the webapp config
      const webapp = externalWebApps.find((app) => app.id === webappId)
      if (!webapp) {
        toast({
          title: 'Error opening web app',
          description: 'Web app not found',
          variant: 'destructive'
        })
        return
      }

      // Add to cache
      const newIframe: CachedIframe = {
        id: webappId,
        type: 'webapp',
        url: webapp.url,
        name: webapp.name,
        lastAccessed: new Date()
      }

      cacheRef.current.set(webappId, newIframe)
      setActiveIframeIdState(webappId)
      updateCache()
      checkCacheSize()

      // Add to recent list
      addToRecentWebApps(webappId, webapp.name)
    },
    [
      externalWebApps,
      externalWebAppsLoaded,
      updateCache,
      checkCacheSize,
      addToRecentWebApps
    ]
  )

  // Close an iframe
  const closeIframe = useCallback(
    (id: string) => {
      cacheRef.current.delete(id)
      if (activeIframeId === id) {
        setActiveIframeIdState(null)
      }
      updateCache()
    },
    [activeIframeId, updateCache]
  )

  // Set the active iframe (null means no iframe is visible)
  const setActiveIframe = useCallback((id: string | null) => {
    setActiveIframeIdState(id)
  }, [])

  // Clear all cached iframes
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear()
    setActiveIframeIdState(null)
    updateCache()
  }, [updateCache])

  // Get the current cache count
  const getCacheCount = useCallback(() => {
    return cacheRef.current.size
  }, [])

  // Backward compatibility: derive background from active iframe
  const background = useMemo(() => {
    if (!activeIframeId) return undefined
    const activeIframe = cacheRef.current.get(activeIframeId)
    if (!activeIframe || activeIframe.type !== 'session') return undefined
    return {
      sessionId: activeIframe.id,
      workspaceId: activeIframe.workspaceId || ''
    }
  }, [activeIframeId])

  // Create a stable Map reference for the context
  // cacheVersion is intentionally in deps to trigger re-renders when cache changes
  const cachedIframes = useMemo(
    () => new Map(cacheRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cacheVersion]
  )

  const contextValue = useMemo(
    () => ({
      cachedIframes,
      activeIframeId,
      recentSessions,
      recentWebApps,
      openSession,
      openWebApp,
      closeIframe,
      setActiveIframe,
      clearAllCache,
      removeFromRecent,
      getCacheCount,
      showCleanupDialog,
      setShowCleanupDialog,
      externalWebApps,
      refreshExternalWebApps,
      addExternalWebApp,
      updateExternalWebApp,
      removeExternalWebApp,
      background
    }),
    [
      cachedIframes,
      activeIframeId,
      recentSessions,
      recentWebApps,
      openSession,
      openWebApp,
      closeIframe,
      setActiveIframe,
      clearAllCache,
      removeFromRecent,
      getCacheCount,
      showCleanupDialog,
      externalWebApps,
      refreshExternalWebApps,
      addExternalWebApp,
      updateExternalWebApp,
      removeExternalWebApp,
      background
    ]
  )

  // Expose iframe cache to window for debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const iframeList = Array.from(cachedIframes.values())
      // @ts-expect-error - Exposing for debug purposes
      window.__IFRAME_CACHE__ = {
        all: iframeList,
        sessions: iframeList.filter((f) => f.type === 'session'),
        webapps: iframeList.filter((f) => f.type === 'webapp'),
        activeId: activeIframeId,
        count: iframeList.length,
        externalWebApps,
        // Helper methods
        closeAll: clearAllCache,
        close: closeIframe,
        openSession,
        openWebApp
      }
    }
  }, [
    cachedIframes,
    activeIframeId,
    externalWebApps,
    clearAllCache,
    closeIframe,
    openSession,
    openWebApp
  ])

  return (
    <IframeCacheContext.Provider value={contextValue}>
      {children}
    </IframeCacheContext.Provider>
  )
}

export function useIframeCache(): IframeCacheContextType {
  const context = useContext(IframeCacheContext)
  if (context === undefined) {
    throw new Error('useIframeCache must be used within an IframeCacheProvider')
  }
  return context
}
