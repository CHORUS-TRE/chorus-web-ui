'use client'

import {
  Bell,
  Building2,
  CircleHelp,
  Database,
  GaugeCircle,
  Globe,
  HelpCircle,
  LaptopMinimal,
  MessageSquare,
  Package,
  SlidersHorizontal,
  Store
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { Link } from '@/components/link'
import { Separator } from '@/components/ui/separator'
import { isSessionPath } from '@/lib/route-utils'
import { cn } from '@/lib/utils'
import { useAuthorization } from '@/providers/authorization-provider'
import { useInstanceConfig } from '~/hooks/use-instance-config'
import { useIframeCache } from '~/providers/iframe-cache-provider'
import { useAppState } from '~/stores/app-state-store'
import { useUserPreferences } from '~/stores/user-preferences-store'

import { Button } from './button'

// All navigation items (for external use like mobile nav, page titles)
// TODO: make it dynamic based on the instance config
export const navItems = [
  {
    label: 'Dashboard',
    icon: GaugeCircle,
    href: '/',
    exact: true
  },
  {
    label: 'Workspaces',
    icon: Package,
    href: '/workspaces'
  },
  {
    label: 'Centers',
    icon: Building2,
    href: '/workspaces'
  },
  {
    label: 'Sessions',
    icon: LaptopMinimal,
    href: '/sessions'
  },
  {
    label: 'App Store',
    icon: Store,
    href: '/app-store'
  },
  {
    label: 'Services',
    icon: Globe,
    href: '/app-store?tab=services'
  }
]

/**
 * Shared sidebar content - used by both floating and fixed sidebars
 */
function SidebarContent({
  pathname,
  searchParams
}: {
  pathname: string
  searchParams: URLSearchParams
}) {
  const router = useRouter()
  const { isAdmin } = useAuthorization()
  const currentTab = searchParams.get('tab')
  const instanceConfig = useInstanceConfig()
  const { externalWebApps } = useIframeCache()
  const { unreadNotificationsCount } = useAppState()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    if (href.includes('?')) {
      const basePath = href.split('?')[0]
      return pathname === basePath || pathname.startsWith(basePath + '/')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const { toggleRightSidebar } = useUserPreferences()
  const isSessionPage = isSessionPath(pathname)

  return (
    <>
      {/* Header with title */}
      <div className="sticky top-0 z-[100] flex h-11 items-center border-b border-muted/50 px-2">
        <span className="px-4 text-xs font-semibold uppercase text-muted-foreground/70">
          Navigation
        </span>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-4 py-4">
        {/* Dashboard */}
        <Link
          href="/"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/', true)
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <GaugeCircle className="h-4 w-4" />
          Dashboard
        </Link>

        {/* Workspaces */}
        <Link
          href="/workspaces"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/workspaces')
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Package className="h-3.5 w-3.5" />
          Workspaces
        </Link>

        {/* Sessions */}
        <Link
          href="/sessions"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/sessions')
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <LaptopMinimal className="h-4 w-4" />
          Sessions
        </Link>

        {/* Data */}
        <Link
          href="/data"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/data')
              ? 'bg-primary/20 text-primary'
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
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/app-store') && currentTab !== 'services'
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Store className="h-4 w-4" />
          App Store
        </Link>
        <Separator className="my-2" />

        <Link
          href="/notifications"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/notifications')
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Bell className="h-4 w-4" />
          Notifications
          {unreadNotificationsCount !== undefined &&
            unreadNotificationsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-contrast-background">
                {unreadNotificationsCount > 99
                  ? '99+'
                  : unreadNotificationsCount}
              </span>
            )}
        </Link>

        <Link
          onClick={() => toggleRightSidebar()}
          href="#"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/data-requests')
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
          title="Help"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Link>

        {instanceConfig.sidebarWebapps.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="sticky top-0 z-[100] flex h-11 items-center px-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground/70">
                Links
              </span>
            </div>
          </>
        )}

        {instanceConfig.sidebarWebapps.map((webappId) => {
          const webapp = externalWebApps.find((w) => w.id === webappId)
          if (!webapp) return null

          const href = `/sessions/${webapp.id}`
          const isLinkActive = isActive(href)

          return (
            <Link
              key={webapp.id}
              href={href}
              variant="underline"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                isLinkActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {webapp.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={webapp.iconUrl}
                  alt=""
                  className="h-4 w-4 object-contain"
                />
              ) : (
                <CircleHelp className="h-4 w-4" />
              )}
              {webapp.name}
            </Link>
          )
        })}

        <div className="flex-1" />

        {/* Admin */}
        {isAdmin && (
          <>
            <Separator />
            <Link
              href="/admin"
              variant="underline"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                pathname.includes('/admin') || isActive('/admin')
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Admin
            </Link>
          </>
        )}
      </nav>
    </>
  )
}

export function LeftSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-y-auto rounded-2xl border border-muted/60 bg-contrast-background/60 backdrop-blur-md'
      )}
    >
      <SidebarContent pathname={pathname} searchParams={searchParams} />
    </div>
  )
}
