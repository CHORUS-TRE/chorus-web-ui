'use client'

import {
  ChevronDown,
  ChevronRight,
  Database,
  GaugeCircle,
  Globe,
  HelpCircle,
  Home,
  Info,
  LaptopMinimal,
  Maximize,
  Package,
  PanelLeftClose,
  Plus,
  Settings,
  Store,
  Trash2,
  UserPlus,
  X
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { WorkbenchDeleteForm } from '@/components/forms/workbench-delete-form'
import { WorkbenchUpdateForm } from '@/components/forms/workbench-update-form'
import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useAppState } from '~/providers/app-state-provider'
import { useAuthentication } from '~/providers/authentication-provider'
import { useIframeCache } from '~/providers/iframe-cache-provider'

import { Button } from './button'
import { toast } from './hooks/use-toast'

interface LeftSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

// All navigation items (for external use like mobile nav, page titles)
export const navItems = [
  {
    label: 'Dashboard',
    icon: GaugeCircle,
    href: '/',
    exact: true
  },
  {
    label: 'My Workspace',
    icon: Home,
    href: '/workspaces',
    className: 'demo-effect'
  },
  {
    label: 'Workspaces',
    icon: Package,
    href: '/workspaces'
  },
  {
    label: 'Sessions',
    icon: LaptopMinimal,
    href: '/sessions'
  },
  {
    label: 'Data',
    icon: Database,
    href: '/data'
  },
  {
    label: 'App Store',
    icon: Store,
    href: '/app-store'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin'
  },
  {
    label: 'Help',
    icon: HelpCircle,
    href: 'void(0)'
  }
]

interface NavSectionProps {
  pathname: string
}

/**
 * Status indicator dot for sessions/webapps
 * - Green pulse: currently visible (active)
 * - Green solid: loaded in DOM but not visible
 * - Orange: not loaded in DOM (persisted from history)
 */
function StatusDot({
  isActive,
  isLoaded
}: {
  isActive: boolean
  isLoaded: boolean
}) {
  if (isActive) {
    return (
      <span
        className="ml-auto h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500"
        title="Currently viewing"
      />
    )
  }
  if (isLoaded) {
    return (
      <span
        className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
        title="Loaded in memory"
      />
    )
  }
  return (
    <span
      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
      title="Not loaded (click to load)"
    />
  )
}

/**
 * Expandable Workspaces section
 */
function WorkspacesSection({ pathname }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_workspaces_expanded')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const { workspaces } = useAppState()
  const { user } = useAuthentication()

  // Persist expanded state
  React.useEffect(() => {
    localStorage.setItem(
      'sidebar_workspaces_expanded',
      JSON.stringify(isExpanded)
    )
  }, [isExpanded])

  // Filter to show workspaces where user is a member (has roles) or is owner
  const userWorkspaces = workspaces
    ?.filter(
      (workspace) =>
        workspace.tag === 'project' &&
        (workspace.userId === user?.id ||
          user?.rolesWithContext?.some(
            (role) => role.context.workspace === workspace.id
          ))
    )
    .sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    )

  // Only highlight "Workspaces" if we're on the workspaces list page exactly
  const isGroupActive = pathname === '/workspaces'

  return (
    <div>
      <div
        className={cn(
          'flex items-center rounded-lg transition-colors',
          isGroupActive && !isExpanded ? 'bg-accent/20' : ''
        )}
      >
        <Link
          href="/workspaces"
          variant="underline"
          className={cn(
            'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-accent',
            isGroupActive ? 'text-accent' : 'text-muted-foreground'
          )}
        >
          <Package className="h-4 w-4" />
          Workspaces
          {userWorkspaces && userWorkspaces.length > 0 && (
            <span className="text-xs text-muted-foreground/70">
              ({userWorkspaces.length})
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center p-2 text-muted-foreground/70 hover:text-muted-foreground"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>

      {isExpanded && userWorkspaces && userWorkspaces.length > 0 && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-muted/30 pl-2">
          {userWorkspaces.map((workspace) => {
            // Only active on exact workspace page, not on sub-pages (sessions, etc.)
            const isActive = pathname === `/workspaces/${workspace.id}`

            return (
              <Link
                key={workspace.id}
                href={`/workspaces/${workspace.id}`}
                variant="underline"
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
                )}
              >
                <span className="truncate">{workspace.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Expandable Sessions section
 */
function SessionsSection({ pathname }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_sessions_expanded')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const { workbenches, workspaces } = useAppState()
  const { user } = useAuthentication()
  const { cachedIframes, activeIframeId, closeIframe } = useIframeCache()

  // Persist expanded state
  React.useEffect(() => {
    localStorage.setItem(
      'sidebar_sessions_expanded',
      JSON.stringify(isExpanded)
    )
  }, [isExpanded])

  // Filter to show only user's sessions
  const userSessions = workbenches
    ?.filter((workbench) =>
      user?.rolesWithContext?.some(
        (role) => role.context.workbench === workbench.id
      )
    )
    .sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    )

  // Only highlight "Sessions" if we're on the sessions list page exactly
  const isGroupActive = pathname === '/sessions'

  return (
    <div>
      <div
        className={cn(
          'flex items-center rounded-lg transition-colors',
          isGroupActive && !isExpanded ? 'bg-accent/20' : ''
        )}
      >
        <Link
          href="/sessions"
          variant="underline"
          className={cn(
            'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-accent',
            isGroupActive ? 'text-accent' : 'text-muted-foreground'
          )}
        >
          <LaptopMinimal className="h-4 w-4" />
          Sessions
          {userSessions && userSessions.length > 0 && (
            <span className="text-xs text-muted-foreground/70">
              ({userSessions.length})
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center p-2 text-muted-foreground/70 hover:text-muted-foreground"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>

      {isExpanded && userSessions && userSessions.length > 0 && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-muted/30 pl-2">
          {userSessions.map((session) => {
            const sessionPath = `/workspaces/${session.workspaceId}/sessions/${session.id}`
            const isActive = pathname === sessionPath
            const isCurrentlyViewing = activeIframeId === session.id
            const isLoaded = cachedIframes.has(session.id!)
            const workspace = workspaces?.find(
              (w) => w.id === session.workspaceId
            )

            return (
              <div
                key={session.id}
                className={cn(
                  'group flex items-start gap-2 rounded-md pr-1 transition-colors',
                  isActive ? 'bg-accent/20' : 'hover:bg-accent/10'
                )}
              >
                <Link
                  href={sessionPath}
                  variant="underline"
                  className={cn(
                    'flex flex-1 items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2">
                      <span className="truncate">
                        {session.name || `Session ${session.id?.slice(0, 8)}`}
                      </span>
                      {isLoaded && (
                        <StatusDot
                          isActive={isCurrentlyViewing}
                          isLoaded={isLoaded}
                        />
                      )}
                    </span>
                    {workspace && (
                      <span className="truncate text-xs text-muted-foreground/60">
                        {workspace.name}
                      </span>
                    )}
                  </div>
                </Link>
                {isLoaded && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-1.5 h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (session.id) {
                        closeIframe(session.id)
                      }
                    }}
                    title="Close window"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Active Session Menu - shown at bottom when on a session page
 */
function ActiveSessionMenu({ pathname }: NavSectionProps) {
  const router = useRouter()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { workbenches, apps, appInstances, refreshWorkbenches } = useAppState()
  const { cachedIframes } = useIframeCache()

  // Check if we're on a session page and get the session
  const sessionMatch = pathname.match(
    /\/workspaces\/([^/]+)\/sessions\/([^/]+)/
  )
  const workspaceId = sessionMatch?.[1]
  const sessionId = sessionMatch?.[2]

  const activeSession = workbenches?.find((wb) => wb.id === sessionId)
  const isLoaded = sessionId ? cachedIframes.has(sessionId) : false

  // Get app instances for this session
  const sessionAppInstances =
    appInstances?.filter((instance) => instance.workbenchId === sessionId) ?? []

  // Toggle fullscreen for active iframe
  const toggleFullscreen = () => {
    const iframe = document.getElementById('workspace-iframe')
    if (iframe) {
      iframe.requestFullscreen()
    }
  }

  // Don't render if not on a session page
  if (!activeSession) return null

  return (
    <>
      {/* Separator */}
      <div className="my-2 border-t border-muted/30" />

      {/* Session name */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LaptopMinimal className="h-4 w-4" />
          <span className="truncate">
            {activeSession.name || `Session ${sessionId?.slice(0, 8)}`}
          </span>
        </div>
      </div>

      {/* Running app instances */}
      {sessionAppInstances.length > 0 && (
        <div className="flex flex-col gap-0.5 px-3">
          {sessionAppInstances.map((instance) => {
            const app = apps?.find((a) => a.id === instance.appId)
            return (
              <div
                key={instance.id}
                className="flex items-center gap-2 rounded px-3 py-1 text-xs text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="truncate">{app?.name || 'Unknown App'}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-0.5 px-3 py-1">
        <button
          onClick={() =>
            router.push(
              `/app-store?workspaceId=${workspaceId}&sessionId=${sessionId}`
            )
          }
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        >
          <Plus className="h-4 w-4" />
          <span>Start New App</span>
        </button>

        <button
          onClick={() =>
            router.push(
              `/workspaces/${workspaceId}/sessions/${sessionId}/members`
            )
          }
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
        </button>

        <button
          onClick={() => setUpdateOpen(true)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>

        {isLoaded && (
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
          >
            <Maximize className="h-4 w-4" />
            <span>Toggle Fullscreen</span>
          </button>
        )}

        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
        >
          <Info className="h-4 w-4" />
          <span>Session Info</span>
        </button>

        <button
          onClick={() => setDeleteOpen(true)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Session</span>
        </button>
      </div>

      {/* Update dialog */}
      {updateOpen && activeSession && (
        <WorkbenchUpdateForm
          workbench={activeSession}
          state={[updateOpen, setUpdateOpen]}
          onSuccess={() => {
            refreshWorkbenches()
            toast({
              title: 'Success!',
              description: 'Session updated'
            })
          }}
        />
      )}

      {/* Delete dialog */}
      {deleteOpen && activeSession && (
        <WorkbenchDeleteForm
          id={activeSession.id}
          state={[deleteOpen, setDeleteOpen]}
          onSuccess={() => {
            refreshWorkbenches()
            router.push('/sessions')
            toast({
              title: 'Success!',
              description: `Session ${activeSession.name} deleted`
            })
          }}
        />
      )}
    </>
  )
}

function ServicesSection({ pathname }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_services_expanded')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const { cachedIframes, externalWebApps, activeIframeId, closeIframe } =
    useIframeCache()

  // Persist expanded state
  React.useEffect(() => {
    localStorage.setItem(
      'sidebar_services_expanded',
      JSON.stringify(isExpanded)
    )
  }, [isExpanded])

  if (externalWebApps.length === 0) return null

  const isGroupActive = pathname.startsWith('/webapps')

  return (
    <div>
      <div
        className={cn(
          'flex items-center rounded-lg transition-colors',
          isGroupActive && !isExpanded ? 'bg-accent/20' : ''
        )}
      >
        <div
          className={cn(
            'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isGroupActive ? 'text-accent' : 'text-muted-foreground'
          )}
        >
          <Globe className="h-4 w-4" />
          Services
          {externalWebApps.length > 0 && (
            <span className="text-xs text-muted-foreground/70">
              ({externalWebApps.length})
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center p-2 text-muted-foreground/70 hover:text-muted-foreground"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-muted/30 pl-2">
          {externalWebApps.map((webapp) => {
            const isActive = pathname === `/webapps/${webapp.id}`
            const isCurrentlyViewing = activeIframeId === webapp.id
            const isLoaded = cachedIframes.has(webapp.id)

            return (
              <div
                key={webapp.id}
                className={cn(
                  'group flex items-center gap-2 rounded-md pr-1 transition-colors',
                  isActive ? 'bg-accent/20' : 'hover:bg-accent/10'
                )}
              >
                <Link
                  href={`/webapps/${webapp.id}`}
                  variant="underline"
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  <span className="truncate">{webapp.name}</span>
                  {isLoaded && (
                    <StatusDot
                      isActive={isCurrentlyViewing}
                      isLoaded={isLoaded}
                    />
                  )}
                </Link>
                {isLoaded && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      closeIframe(webapp.id)
                    }}
                    title="Close service"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Sidebar header with title and close button
 * Uses negative margins to extend to container edges (compensating for p-4)
 */
function SidebarHeader({
  onClose,
  showCloseButton
}: {
  onClose?: () => void
  showCloseButton?: boolean
}) {
  return (
    <div className="glass-surface sticky top-0 z-[100] flex h-11 items-center justify-between border-b border-muted/50 p-2">
      <h1 className="ml-2 text-lg font-semibold text-foreground">CHORUS</h1>
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-accent hover:text-accent/80"
          onClick={onClose}
          title="Close sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

/**
 * Help button - toggles right sidebar
 */
function HelpButton() {
  const { toggleRightSidebar } = useAppState()

  return (
    <button
      onClick={toggleRightSidebar}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
    >
      <HelpCircle className="h-4 w-4" />
      Help
    </button>
  )
}

/**
 * Shared sidebar content - used by both floating and fixed sidebars
 */
function SidebarContent({
  pathname,
  onClose,
  showCloseButton
}: {
  pathname: string
  onClose?: () => void
  showCloseButton?: boolean
}) {
  return (
    <>
      {/* Header with title and close button */}
      <SidebarHeader onClose={onClose} showCloseButton={showCloseButton} />

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-4 py-2">
        {/* Dashboard */}
        <Link
          href="/"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            pathname === '/'
              ? 'bg-accent/20 text-accent'
              : 'text-muted-foreground'
          )}
        >
          <GaugeCircle className="h-4 w-4" />
          Dashboard
        </Link>

        {/* My Workspace */}
        {/* <Link
          href={'#'}
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent demo-effect',
            isMyWorkspaceActive
              ? 'bg-accent/20 text-accent'
              : 'text-muted-foreground'
          )}
        >
          <Home className="h-4 w-4 demo-effect" />
          My Workspace
        </Link> */}

        {/* Workspaces (expandable) */}
        <WorkspacesSection pathname={pathname} />

        {/* Sessions (expandable) */}
        <SessionsSection pathname={pathname} />

        {/* Data */}
        <Link
          href="/data"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            pathname.startsWith('/data')
              ? 'bg-accent/20 text-accent'
              : 'text-muted-foreground'
          )}
        >
          <Database className="h-4 w-4" />
          Data
        </Link>

        {/* App Store */}
        <Link
          href="/app-store"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            pathname.startsWith('/app-store')
              ? 'bg-accent/20 text-accent'
              : 'text-muted-foreground'
          )}
        >
          <Store className="h-4 w-4" />
          App Store
        </Link>

        {/* Services section (after App Store) */}
        <ServicesSection pathname={pathname} />

        {/* Settings */}
        <Link
          href="/admin"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            pathname.startsWith('/admin')
              ? 'bg-accent/20 text-accent'
              : 'text-muted-foreground'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        {/* Help */}
        <HelpButton />

        {/* Active Session Menu - shown when on session page */}
        <ActiveSessionMenu pathname={pathname} />
      </nav>
    </>
  )
}

export function LeftSidebar({
  isOpen,
  setIsOpen,
  isHovered,
  onHoverStart: _onHoverStart,
  onHoverEnd: _onHoverEnd
}: LeftSidebarProps) {
  const pathname = usePathname()

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          'glass-surface flex h-full flex-col gap-2 overflow-y-auto rounded-2xl border border-muted/40 transition-transform duration-300 ease-in-out',
          !isOpen && !isHovered ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <SidebarContent
          pathname={pathname}
          onClose={handleClose}
          showCloseButton={isOpen}
        />
      </div>
    </>
  )
}
