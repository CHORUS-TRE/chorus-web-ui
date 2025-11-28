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
  Monitor,
  Package,
  Settings,
  Store,
  X
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useIframeCache } from '~/providers/iframe-cache-provider'

import { Button } from './button'

interface LeftSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

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
    href: '/workspaces/tada'
  },
  {
    label: 'Workspaces',
    icon: Package,
    href: '/workspaces'
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

function NavItems({ pathname }: NavSectionProps) {
  return (
    <>
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            variant="underline"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
              isActive ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </>
  )
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

function RecentSessionsSection({ pathname }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const {
    cachedIframes,
    recentSessions,
    activeIframeId,
    closeIframe,
    removeFromRecent
  } = useIframeCache()

  if (recentSessions.length === 0) return null

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground"
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <LaptopMinimal className="h-3 w-3" />
        Sessions ({recentSessions.length})
      </button>

      {isExpanded && (
        <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l border-muted/30 pl-2">
          {recentSessions.map((session) => {
            const isActive =
              pathname ===
              `/workspaces/${session.workspaceId}/sessions/${session.id}`
            const isCurrentlyViewing = activeIframeId === session.id
            const isLoaded = cachedIframes.has(session.id)

            return (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center gap-2 rounded-md pr-1 transition-colors',
                  isActive ? 'bg-accent/20' : 'hover:bg-accent/10'
                )}
              >
                <Link
                  href={`/workspaces/${session.workspaceId}/sessions/${session.id}`}
                  variant="underline"
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  <Monitor className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{session.name}</span>
                  <StatusDot
                    isActive={isCurrentlyViewing}
                    isLoaded={isLoaded}
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // If loaded, close from cache
                    if (isLoaded) {
                      closeIframe(session.id)
                    }
                    // Always remove from recent
                    removeFromRecent(session.id, 'session')
                  }}
                  title="Remove session"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RecentWebAppsSection({ pathname }: NavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const {
    cachedIframes,
    recentWebApps,
    activeIframeId,
    closeIframe,
    removeFromRecent
  } = useIframeCache()

  if (recentWebApps.length === 0) return null

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground"
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <Globe className="h-3 w-3" />
        Web Apps ({recentWebApps.length})
      </button>

      {isExpanded && (
        <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l border-muted/30 pl-2">
          {recentWebApps.map((webapp) => {
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
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{webapp.name}</span>
                  <StatusDot
                    isActive={isCurrentlyViewing}
                    isLoaded={isLoaded}
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // If loaded, close from cache
                    if (isLoaded) {
                      closeIframe(webapp.id)
                    }
                    // Always remove from recent
                    removeFromRecent(webapp.id, 'webapp')
                  }}
                  title="Remove web app"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function LeftSidebar({
  isOpen,
  setIsOpen: _setIsOpen,
  isHovered,
  onHoverStart,
  onHoverEnd
}: LeftSidebarProps) {
  // _setIsOpen is available for future use (e.g., collapse button)
  void _setIsOpen
  const pathname = usePathname()

  return (
    <>
      {/* Floating sidebar when hovering and closed */}
      {!isOpen && isHovered && (
        <div
          className="fixed left-0 top-[110px] z-40 h-[calc(100vh-110px)] w-80 duration-300 animate-in slide-in-from-left"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          <div className="glass-surface flex h-full flex-col gap-2 overflow-y-auto rounded-r-2xl border border-muted/40 p-4 shadow-2xl">
            <nav className="flex flex-col gap-1">
              <NavItems pathname={pathname} />
            </nav>

            {/* Dynamic sections */}
            <div className="mt-2 border-t border-muted/30 pt-2">
              <RecentSessionsSection pathname={pathname} />
              <RecentWebAppsSection pathname={pathname} />
            </div>
          </div>
        </div>
      )}

      {/* Regular sidebar when open - slides in/out */}
      <div
        className={cn(
          'glass-surface flex h-full flex-col gap-2 overflow-y-auto rounded-2xl border border-muted/40 p-4 transition-transform duration-300 ease-in-out',
          !isOpen && !isHovered ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <nav className="flex flex-col gap-1">
          <NavItems pathname={pathname} />
        </nav>

        {/* Dynamic sections */}
        <div className="mt-2 border-t border-muted/30 pt-2">
          <RecentSessionsSection pathname={pathname} />
          <RecentWebAppsSection pathname={pathname} />
        </div>
      </div>
    </>
  )
}
