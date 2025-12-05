'use client'

import {
  Building2,
  ChevronUp,
  GaugeCircle,
  Globe,
  HelpCircle,
  LaptopMinimal,
  LogOut,
  Package,
  PanelLeftClose,
  Settings,
  Store,
  User
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { useAuthentication } from '~/providers/authentication-provider'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

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
    label: 'App Store',
    icon: Store,
    href: '/app-store'
  },
  {
    label: 'Services',
    icon: Globe,
    href: '/app-store?tab=webapps'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin'
  }
]

/**
 * Sidebar header with title and close button
 */
function SidebarHeader({
  onClose,
  showCloseButton
}: {
  onClose?: () => void
  showCloseButton?: boolean
}) {
  return (
    <div className="sticky top-0 z-[100] mb-4 flex h-11 items-center justify-between border-b border-muted/60 bg-contrast-background/60 p-2 backdrop-blur-md">
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
 * User profile section at the bottom of sidebar
 */
function UserProfileSection() {
  const { user, logout } = useAuthentication()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Get initials for avatar
  const initials =
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()

  // Get platform/global roles (exclude Workspace* and Workbench* roles)
  const globalRoles = user.rolesWithContext
    ?.filter(
      (role) =>
        !role.name.startsWith('Workspace') && !role.name.startsWith('Workbench')
    )
    .map((role) => role.name)
    .filter((name, index, arr) => arr.indexOf(name) === index) // unique
    .sort((a, b) => a.localeCompare(b)) // alphabetical order

  return (
    <div className="border-t border-muted/60 p-2 text-muted">
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/30"
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
            {initials || <User className="h-4 w-4" />}
          </div>
          {/* Name & Username */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs">
              {user.username}
            </p>
          </div>
          {/* Chevron */}
          <ChevronUp
            className={cn(
              'h-4 w-4 shrink-0 text-muted transition-transform',
              menuOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 max-h-64 overflow-y-auto rounded-lg border border-muted/60 bg-contrast-background p-1 shadow-lg">
            {/* Roles section */}
            {globalRoles && globalRoles.length > 0 && (
              <div className="border-b border-muted/40 px-2 py-2">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Roles
                </p>
                <div className="flex flex-wrap gap-1">
                  {globalRoles.map((role) => (
                    <span
                      key={role}
                      className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Link
              href={`/users/${user.id}`}
              variant="underline"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/30"
              onClick={() => setMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/30"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Help button - toggles right sidebar
 */
function HelpButton() {
  const { toggleRightSidebar } = useUserPreferences()

  return (
    <button
      onClick={toggleRightSidebar}
      className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
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
  searchParams,
  onClose,
  showCloseButton
}: {
  pathname: string
  searchParams: URLSearchParams
  onClose?: () => void
  showCloseButton?: boolean
}) {
  const router = useRouter()
  const { canManageUsers, canManageSettings } = useAuthorizationViewModel()
  const { workspaceFilters, setWorkspaceFilter } = useUserPreferences()
  const currentTab = searchParams.get('tab')

  // Check if All Workspaces (both center and project) is active
  const isAllWorkspacesActive =
    pathname === '/workspaces' &&
    workspaceFilters.showCenter &&
    workspaceFilters.showProject

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

  const handleWorkspacesClick = () => {
    // Set filters for All Workspaces view (both centers and projects)
    setWorkspaceFilter('showCenter', true)
    setWorkspaceFilter('showProject', true)
    router.push('/workspaces')
  }

  const handleProjectsClick = () => {
    // Set filters for Projects view
    setWorkspaceFilter('showCenter', false)
    setWorkspaceFilter('showProject', true)
    router.push('/workspaces')
  }

  const handleCentersClick = () => {
    // Set filters for Centers view
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
      <SidebarHeader onClose={onClose} showCloseButton={showCloseButton} />

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-4 py-2">
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
        <button
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
        </button>

        {/* Projects */}
        <button
          onClick={handleProjectsClick}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 pl-7 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isProjectsActive
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Package className="h-3.5 w-3.5" />
          Projects
        </button>

        {/* Centers */}
        <button
          onClick={handleCentersClick}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-1.5 pl-7 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
            isCentersActive
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Building2 className="h-4 w-4" />
          Centers
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

        {/* Settings */}
        {(canManageUsers || canManageSettings) && (
          <Link
            href="/admin"
            variant="underline"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
              isActive('/admin')
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        )}

        {/* Help */}
        <HelpButton />
      </nav>

      {/* User profile section at bottom */}
      <UserProfileSection />
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
  const searchParams = useSearchParams()

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          'flex h-full flex-col overflow-y-auto rounded-2xl border border-muted/60 bg-contrast-background/60 backdrop-blur-md transition-transform duration-300 ease-in-out',
          !isOpen && !isHovered ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <SidebarContent
          pathname={pathname}
          searchParams={searchParams}
          onClose={handleClose}
          showCloseButton={isOpen}
        />
      </div>
    </>
  )
}
