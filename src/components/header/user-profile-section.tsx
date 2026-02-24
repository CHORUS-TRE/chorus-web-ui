'use client'

import {
  Bell,
  ChevronDown,
  FlaskConical,
  LogOut,
  Moon,
  Settings,
  Sun,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'

export function UserProfileSection() {
  const router = useRouter()
  const { user, logout } = useAuthentication()
  const { isAdmin } = useAuthorization()
  const { theme, setTheme } = useTheme()
  const { unreadNotificationsCount } = useAppState()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/30"
          title={`${user.firstName} ${user.lastName}`}
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {initials || <User className="h-4 w-4" />}
          </div>
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown menu */}
      <DropdownMenuContent
        align="end"
        className="z-[100] mt-1 max-h-[90vh] min-w-[280px] overflow-y-auto rounded-xl border border-muted/60 bg-contrast-background p-1 shadow-2xl backdrop-blur-md"
      >
        {/* Profile Header */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium">
            {initials || <User className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              @{user.username}
            </p>
            <Link
              href={`/settings/profile`}
              variant="underline"
              className="mt-1 block text-xs font-medium"
            >
              View your profile
            </Link>
          </div>
        </div>

        {/* Roles Section (optional, moved to bottom) */}
        {globalRoles && globalRoles.length > 0 && (
          <>
            <Separator className="my-1" />
            <div className="px-3 py-2">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Your Roles
              </p>
              <div className="flex flex-wrap gap-1">
                {globalRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-1" />

        {/* Quick Settings */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
        </div>

        <Separator className="my-1" />

        {/* Section 4: Settings & Data */}
        <div className="py-1">
          <DropdownMenuItem asChild>
            <Link
              href={`/settings`}
              variant="underline"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                variant="underline"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link
              href={`/notifications`}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotificationsCount !== undefined &&
                unreadNotificationsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto h-4 px-1 text-[10px]"
                  >
                    {unreadNotificationsCount}
                  </Badge>
                )}
            </Link>
          </DropdownMenuItem>
        </div>

        {/* Section 3: Lab */}
        {isAdmin && (
          <>
            <Separator className="my-1" />
            <div className="py-1">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/lab`)
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
              >
                <FlaskConical className="h-4 w-4" />
                Lab
              </DropdownMenuItem>
            </div>
          </>
        )}

        <Separator className="my-1" />

        {/* Section 1: Account Management */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-foreground transition-colors hover:bg-muted/40"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
