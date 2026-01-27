'use client'

import {
  Building2,
  GaugeCircle,
  Globe,
  HelpCircle,
  LaptopMinimal,
  Package,
  PanelLeftClose,
  Store
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { useInstanceConfig } from '~/hooks/use-instance-config'

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
    href: '/app-store?tab=webapps'
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
  const { workspaceFilters, setWorkspaceFilter, toggleRightSidebar } =
    useUserPreferences()
  const currentTab = searchParams.get('tab')
  const instanceConfig = useInstanceConfig()

  // Check if Projects filter is active (only projects, not centers)
  const isProjectsActive =
    pathname === '/workspaces' &&
    !workspaceFilters.showCenter &&
    workspaceFilters.showProject

  // Check if Centers filter is active (only centers, not projects)
  const isCentersActive =
    pathname === '/workspaces' &&
    workspaceFilters.showCenter &&
    !workspaceFilters.showProject

  const handleProjectsClick = () => {
    // Set filters for Projects view - preserve showMyWorkspaces preference
    setWorkspaceFilter('showCenter', false)
    setWorkspaceFilter('showProject', true)
    router.push('/workspaces')
  }

  const handleCentersClick = () => {
    // Set filters for Centers view - always show all centers (not just mine)
    setWorkspaceFilter('showMyWorkspaces', false)
    setWorkspaceFilter('showCenter', true)
    setWorkspaceFilter('showProject', false)
    router.push('/workspaces')
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    if (href.includes('?')) {
      const basePath = href.split('?')[0]
      return pathname === basePath || pathname.startsWith(basePath + '/')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Header with title and close button */}
      {/* <SidebarHeader onClose={onClose} showCloseButton={showCloseButton} /> */}

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
        {/* <button
          onClick={handleWorkspacesClick}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isAllWorkspacesActive
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Package className="h-4 w-4" />
          Workspaces
        </button> */}

        {/* Centers */}
        {instanceConfig.tags.find((tag) => tag.id === 'center')?.display && (
          <button
            onClick={handleCentersClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
              isCentersActive
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Building2 className="h-4 w-4" />
            {instanceConfig.tags.find((tag) => tag.id === 'center')?.label ||
              'Centers'}
          </button>
        )}

        {/* Projects */}
        <button
          onClick={handleProjectsClick}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isProjectsActive
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Package className="h-3.5 w-3.5" />
          {instanceConfig.tags.find((tag) => tag.id === 'project')?.label ||
            'Workspaces'}
        </button>

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

        {/* App Store */}
        <Link
          href="/app-store"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isActive('/app-store') && currentTab !== 'webapps'
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Store className="h-4 w-4" />
          App Store
        </Link>

        {/* Services */}
        <Link
          href="/app-store?tab=webapps"
          variant="underline"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            pathname.includes('/webapps') ||
              (isActive('/app-store') && currentTab === 'webapps')
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Globe className="h-4 w-4" />
          Services
        </Link>

        {/* Help */}
        <button
          onClick={toggleRightSidebar}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            'text-muted-foreground'
          )}
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </button>
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
