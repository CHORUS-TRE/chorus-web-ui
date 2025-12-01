'use client'

import {
  ChevronDown,
  ChevronRight,
  Database,
  GaugeCircle,
  Globe,
  HelpCircle,
  Home,
  LaptopMinimal,
  Package,
  PanelLeftClose,
  Settings,
  Store
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useAppState } from '~/providers/app-state-provider'
import { useAuthentication } from '~/providers/authentication-provider'
import { useIframeCache } from '~/providers/iframe-cache-provider'

import { Button } from './button'

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
 * Workspaces section with sessions nested under each workspace
 * Always expanded, no toggle button
 */
function WorkspacesSection({ pathname }: NavSectionProps) {
  const { workspaces, workbenches, apps, appInstances } = useAppState()
  const { user } = useAuthentication()
  const { cachedIframes } = useIframeCache()

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

  // Get sessions for a workspace
  const getWorkspaceSessions = (workspaceId: string) => {
    return workbenches
      ?.filter((wb) => wb.workspaceId === workspaceId)
      .filter((wb) =>
        user?.rolesWithContext?.some((role) => role.context.workbench === wb.id)
      )
      .sort(
        (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      )
  }

  // Get display name for a session (app names if running, otherwise session name)
  const getSessionDisplayName = (sessionId: string, sessionName?: string) => {
    const sessionAppInstances = appInstances?.filter(
      (instance) => instance.workbenchId === sessionId
    )
    if (sessionAppInstances && sessionAppInstances.length > 0) {
      const appNames = sessionAppInstances
        .map((instance) => apps?.find((a) => a.id === instance.appId)?.name)
        .filter(Boolean)
      if (appNames.length > 0) {
        return appNames.join(', ')
      }
    }
    return sessionName || `Session ${sessionId?.slice(0, 8)}`
  }

  // Only highlight "Workspaces" if we're on the workspaces list page exactly
  const isGroupActive = pathname === '/workspaces'

  return (
    <div>
      {/* Workspaces header - no expand button */}
      <Link
        href="/workspaces"
        variant="underline"
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-accent',
          isGroupActive ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
        )}
      >
        <Package className="h-4 w-4" />
        Workspaces
      </Link>

      {/* Workspaces list - always visible */}
      {userWorkspaces && userWorkspaces.length > 0 && (
        <div className="ml-4 mt-1 flex flex-col gap-3 border-l border-muted/30 pl-2">
          {userWorkspaces.map((workspace) => {
            const isWorkspaceActive =
              pathname === `/workspaces/${workspace.id}` ||
              pathname.startsWith(`/workspaces/${workspace.id}/`)
            const workspaceSessions = getWorkspaceSessions(workspace.id!)

            return (
              <div key={workspace.id} className="flex flex-col gap-1">
                {/* Workspace link */}
                <Link
                  href={`/workspaces/${workspace.id}`}
                  variant="underline"
                  className={cn(
                    'flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium transition-colors',
                    isWorkspaceActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  <span className="truncate">{workspace.name}</span>
                </Link>

                {/* Sessions under this workspace */}
                {workspaceSessions && workspaceSessions.length > 0 && (
                  <div className="ml-2 flex flex-col gap-1">
                    {workspaceSessions.map((session) => {
                      const sessionPath = `/workspaces/${workspace.id}/sessions/${session.id}`
                      const isActive = pathname === sessionPath
                      const isLoaded = cachedIframes.has(session.id!)

                      return (
                        <Link
                          key={session.id}
                          href={sessionPath}
                          variant="underline"
                          className={cn(
                            'flex items-start gap-2 rounded px-2 py-1.5 text-xs transition-colors',
                            isActive
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted-foreground/80 hover:bg-accent/10 hover:text-accent'
                          )}
                        >
                          <LaptopMinimal
                            className={cn(
                              'mt-0.5 h-3.5 w-3.5 shrink-0',
                              isLoaded && 'text-green-500'
                            )}
                          />
                          <span className="flex-1 leading-relaxed">
                            {getSessionDisplayName(session.id!, session.name)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
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
  const { cachedIframes, externalWebApps } = useIframeCache()

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
        <div className="ml-4 mt-1 flex flex-col gap-1 pl-2">
          {externalWebApps.map((webapp) => {
            const isActive = pathname === `/webapps/${webapp.id}`
            const isLoaded = cachedIframes.has(webapp.id)

            return (
              <Link
                key={webapp.id}
                href={`/webapps/${webapp.id}`}
                variant="underline"
                className={cn(
                  'flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors',
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
                )}
              >
                <Globe
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    isLoaded && 'text-green-500'
                  )}
                />
                <span className="truncate">{webapp.name}</span>
              </Link>
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

        {/* Workspaces with nested sessions */}
        <WorkspacesSection pathname={pathname} />

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
