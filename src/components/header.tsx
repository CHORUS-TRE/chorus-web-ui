'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Globe,
  HelpCircle,
  LaptopMinimal,
  Loader2,
  LogOut,
  Maximize,
  Moon,
  MoreVertical,
  Rocket,
  Settings,
  Sun,
  Trash2,
  User,
  UserPlus,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import {
  AppInstance,
  K8sAppInstanceStatus,
  WorkbenchServerPodStatus
} from '@/domain/model'
import { useInstanceLogo } from '@/hooks/use-instance-config'
import { isSessionPath } from '@/lib/route-utils'
import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { deleteAppInstance } from '@/view-model/app-instance-view-model'
import { AppBreadcrumb } from '~/components/ui/app-breadcrumb'

import { WorkbenchDeleteForm } from './forms/workbench-delete-form'
import { WorkbenchUpdateForm } from './forms/workbench-update-form'
import { useAppInstanceStatus } from './hooks/use-app-instance-status'
import { toast } from './hooks/use-toast'
import { useWorkbenchStatus } from './hooks/use-workbench-status'

export function Header() {
  const router = useRouter()
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    refreshAppInstances,
    refreshWorkbenches,
    unreadNotificationsCount
  } = useAppState()
  const instanceLogo = useInstanceLogo()
  const {
    background,
    setActiveIframe,
    cachedIframes,
    activeIframeId,
    closeIframe,
    recentSessions,
    recentWebApps,
    openSession,
    openWebApp,
    removeFromRecent
  } = useIframeCache()
  const { user } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateSessionId, setUpdateSessionId] = useState<string | null>(null)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme, setTheme } = useTheme()
  const defaultLogo = theme === 'light' ? logoBlack : logoWhite
  const logo = theme === 'light' ? instanceLogo?.light : instanceLogo?.dark
  const { toggleFullscreen } = useFullscreenContext()
  const { toggleRightSidebar } = useUserPreferences()
  const pathname = usePathname()

  // Track launching apps for the current session
  const launchingApps = useMemo(() => {
    if (!params.sessionId || !appInstances) return []
    // Items that are actively starting up
    return appInstances.filter(
      (i) =>
        i.workbenchId === params.sessionId &&
        (i.k8sStatus === K8sAppInstanceStatus.PROGRESSING ||
          i.k8sStatus === K8sAppInstanceStatus.UNKNOWN ||
          i.k8sStatus === K8sAppInstanceStatus.EMPTY ||
          !i.k8sStatus)
    )
  }, [params.sessionId, appInstances])

  // Automatically open menu when a new app is launching or session is starting
  const prevLaunchingAppsCount = useRef(0)
  const prevSessionId = useRef<string | null>(null)

  useEffect(() => {
    // If we have more launching apps than before, or we switched to a new session that is starting
    const hasMoreLaunchingApps =
      launchingApps.length > prevLaunchingAppsCount.current

    const session = workbenches?.find((wb) => wb.id === params.sessionId)
    const isNewSessionStarting =
      params.sessionId !== prevSessionId.current &&
      session &&
      session.serverPodStatus !== WorkbenchServerPodStatus.READY

    if (hasMoreLaunchingApps || isNewSessionStarting) {
      setIsMenuOpen(true)
    }

    prevLaunchingAppsCount.current = launchingApps.length
    prevSessionId.current = params.sessionId || null
  }, [launchingApps.length, params.sessionId, workbenches])

  const getAppName = (appId: string) =>
    apps?.find((a) => a.id === appId)?.name ?? 'App'

  // Get display name for a session (app names if running, otherwise session name)
  const getSessionDisplayName = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    return session?.name || `Session ${sessionId?.slice(0, 8)}`
  }

  const getSessionApps = (sessionId: string): AppInstance[] => {
    return (
      appInstances?.filter((instance) => instance.workbenchId === sessionId) ||
      []
    )
  }

  const closeAppInstance = async (id: string, name?: string) => {
    const result = await deleteAppInstance(id)
    if (result.error) {
      toast({
        title: 'Error closing app',
        description: result.error,
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'App closed',
      description: `${name || 'App'} has been closed`
    })
    refreshAppInstances()
  }

  // --- Sub-components for real-time status ---

  const AppLaunchingPill = ({
    initialInstance
  }: {
    initialInstance: AppInstance
  }) => {
    const { data: statusData } = useAppInstanceStatus(initialInstance.id)
    const currentStatus = statusData?.status || initialInstance.k8sStatus

    // If it reached a terminal state, hide the launching status
    if (
      currentStatus === K8sAppInstanceStatus.RUNNING ||
      currentStatus === K8sAppInstanceStatus.COMPLETE ||
      currentStatus === K8sAppInstanceStatus.FAILED ||
      currentStatus === K8sAppInstanceStatus.STOPPED ||
      currentStatus === K8sAppInstanceStatus.KILLED
    ) {
      return (
        <>
          <CheckCircle2 className="h-3 w-3 text-[#88b04b]" />
          <p className="text-[10px] font-medium leading-none text-muted-foreground/60">
            Session Active
          </p>
        </>
      )
    }

    return (
      <>
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#88b04b] shadow-[0_0_8px_#88b04b]" />
        <p className="text-[10px] font-bold uppercase leading-none text-[#88b04b]">
          Launching {getAppName(initialInstance.appId)}...
        </p>
      </>
    )
  }

  const SessionStatusSection = ({
    sessionId,
    onDelete
  }: {
    sessionId: string
    onDelete: (id: string) => void
  }) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    const { data: statusData } = useWorkbenchStatus(sessionId)

    if (!session) return null

    const currentStatus = statusData?.status || session.serverPodStatus
    const currentMessage = statusData?.message || session.serverPodMessage
    const isRunning = currentStatus === WorkbenchServerPodStatus.READY

    return (
      <div className="space-y-4 p-4 pb-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          Session
        </p>

        <div className="space-y-3">
          <div className="group/session flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
                <LaptopMinimal className="h-5 w-5 text-[#88b04b]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight text-white">
                  {session.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground/60">
                  {isRunning ? 'Running' : currentStatus}
                </p>
                {!isRunning && currentMessage && (
                  <p className="mt-1 w-36 whitespace-normal text-[11px] leading-relaxed text-muted-foreground/60">
                    {parseK8sInsufficientResourceMessage(currentMessage)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <span className="text-[11px] font-bold text-[#88b04b]"></span>
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-75 transition-opacity hover:bg-white/5 group-hover/session:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(sessionId)
                }}
                title="Delete Session"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {/* Progress Bar */}
          {!isRunning && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  isRunning
                    ? 'w-full bg-[#88b04b]'
                    : 'w-1/3 animate-pulse bg-[#88b04b]/40'
                )}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  const AppInstanceStatusRow = ({
    instance,
    onClose
  }: {
    instance: AppInstance
    onClose: (id: string, name: string) => void
  }) => {
    const { data: statusData } = useAppInstanceStatus(instance.id)

    const appName =
      apps?.find((a) => a.id === instance.appId)?.name || instance.name || 'App'

    const currentStatus = statusData?.status || instance.k8sStatus
    const currentMessage = statusData?.message || instance.k8sMessage
    const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING

    return (
      <div className="space-y-3">
        <div className="group/app flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
              <Rocket className="h-5 w-5 text-[#88b04b]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-white">
                {appName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground/60">
                {isRunning ? 'Running' : currentStatus}
              </p>
              {!isRunning && (
                <p className="mt-1 w-36 whitespace-normal text-[11px] leading-relaxed text-muted-foreground/60">
                  {parseK8sInsufficientResourceMessage(currentMessage)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <span className="text-[11px] font-bold text-[#88b04b]"></span>
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-75 transition-opacity hover:bg-white/5 group-hover/app:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onClose(instance.id, appName)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        {!isRunning && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={cn(
                'h-full transition-all duration-1000',
                isRunning
                  ? 'w-full bg-[#88b04b]'
                  : 'w-1/3 animate-pulse bg-[#88b04b]/40'
              )}
            />
          </div>
        )}
      </div>
    )
  }

  const renderSessionMenuContent = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    if (!session) return null

    const appsRunning = getSessionApps(sessionId)

    return (
      <div className="flex min-w-[260px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1a1b23] shadow-2xl">
        <SessionStatusSection
          sessionId={sessionId}
          onDelete={setDeleteSessionId}
        />

        {/* Applications Section */}
        <div className="space-y-4 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            Applications
          </p>

          {appsRunning.length > 0 ? (
            <div className="space-y-4">
              {appsRunning.map((instance: AppInstance) => (
                <AppInstanceStatusRow
                  key={instance.id}
                  instance={instance}
                  onClose={closeAppInstance}
                />
              ))}
            </div>
          ) : (
            <div className="py-2">
              <p className="text-[11px] italic text-muted-foreground/40">
                No apps active in this session
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-white/5" />

        {/* Actions Section */}
        <div className="space-y-0.5 p-1.5">
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/workspaces/${session.workspaceId}/sessions/${sessionId}/app-store`
              )
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Rocket className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Launch an app
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/workspaces/${session.workspaceId}/users`)
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <UserPlus className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Add Member
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setUpdateSessionId(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Settings className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={toggleFullscreen}
            disabled
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Maximize className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Fullscreen
          </DropdownMenuItem>
        </div>

        {/* Delete Section */}
        <div className="mt-auto border-t border-white/5 bg-red-500/5 p-1.5">
          <DropdownMenuItem
            onClick={() => setDeleteSessionId(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 text-red-400/60 transition-colors group-hover:text-red-400" />
            Delete Session
          </DropdownMenuItem>
        </div>
      </div>
    )
  }

  const renderSessionInfoHover = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    if (!session) return null

    const appsRunning = getSessionApps(sessionId)

    return (
      <div className="flex flex-col overflow-hidden">
        <p className="px-2.5 pt-3 text-xs font-bold text-muted-foreground">
          {session.name}
        </p>
        <div className="flex items-center justify-between border-t border-muted/10 bg-accent/[0.03] p-2.5">
          {appsRunning.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground">
                Apps
              </p>
              <div className="flex flex-wrap gap-1">
                {appsRunning.map((instance: AppInstance) => {
                  const appName =
                    apps?.find((a) => a.id === instance.appId)?.name ||
                    instance.name ||
                    'App'
                  return (
                    <div
                      key={instance.id}
                      className="flex items-center gap-1.5 rounded-md border border-muted/40 bg-muted/20 px-1.5 py-0.5"
                    >
                      <span className="max-w-[120px] truncate text-[10px] font-medium text-foreground/70">
                        {appName}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground">
                No apps running
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  function UserProfileSection() {
    const { logout } = useAuthentication()
    const { isAdmin } = useAuthorization()

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
          !role.name.startsWith('Workspace') &&
          !role.name.startsWith('Workbench')
      )
      .map((role) => role.name)
      .filter((name, index, arr) => arr.indexOf(name) === index) // unique
      .sort((a, b) => a.localeCompare(b)) // alphabetical order

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted/30"
            title={`${user.firstName} ${user.lastName}`}
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
              {initials || <User className="h-4 w-4" />}
            </div>
            {/* Chevron */}
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
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

  return (
    <>
      <nav
        className="flex h-11 min-w-full flex-nowrap items-center justify-between gap-2 border-b border-muted/40 bg-contrast-background/80 px-2 text-foreground shadow-lg backdrop-blur-sm"
        id="header"
      >
        <div className="flex shrink-0 items-center">
          <Link href="/" variant="muted" className="shrink-0">
            <Image
              src={defaultLogo}
              alt="Chorus"
              height={32}
              width={54}
              className="aspect-auto cursor-pointer"
              id="logo"
              priority
            />
            {logo && (
              <Image
                src={logo}
                alt="Chorus"
                height={32}
                width={75}
                className="ml-4 aspect-[80/33] cursor-pointer"
                id="logo"
                priority
              />
            )}
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <AppBreadcrumb />
              {isSessionPath(pathname) && params.sessionId && (
                /* Unified Session Pill */
                <div className="group/pill flex h-9 items-center rounded-xl border border-muted bg-muted/50 shadow-lg backdrop-blur-md transition-all hover:bg-muted/80">
                  {/* Left: Info & Status */}
                  <div className="flex min-w-0 flex-col justify-center px-4">
                    <p className="truncate text-[13px] font-bold leading-tight text-white">
                      {getSessionDisplayName(params.sessionId)}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {launchingApps.length > 0 ? (
                        <AppLaunchingPill initialInstance={launchingApps[0]} />
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#88b04b]" />
                          <p className="text-[10px] font-medium leading-none text-muted-foreground/60">
                            Session Active
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vertical Separator */}
                  <div className="h-5 w-px bg-white/10" />

                  {/* Right: MENU Trigger */}
                  <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="group/menu ml-1 mr-0.5 flex h-7 items-center gap-2 rounded-full px-3 transition-colors hover:text-accent">
                        <span className="text-[11px] font-black tracking-widest text-white">
                          MENU
                        </span>
                        <MoreVertical className="h-3.5 w-3.5 text-white/80" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="mt-2 border-none bg-transparent p-0 shadow-none"
                      align="end"
                    >
                      {renderSessionMenuContent(params.sessionId)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Recent sessions and web apps as Tabs */}
        <div className="flex h-full w-full min-w-0 items-end justify-end self-stretch">
          {user && (recentSessions.length > 0 || recentWebApps.length > 0) && (
            <div className="flex h-full items-end justify-start gap-x-2 overflow-x-auto overflow-y-hidden px-8">
              {/* Recent Sessions - displayed in order added (most recent first) */}
              {recentSessions.map((recentSession) => {
                const isActive = activeIframeId === recentSession.id
                const sessionWorkbench = workbenches?.find(
                  (wb) => wb.id === recentSession.id
                )
                const isLoaded = cachedIframes.has(recentSession.id)

                return (
                  <HoverCard
                    key={recentSession.id}
                    openDelay={200}
                    closeDelay={100}
                  >
                    <HoverCardTrigger asChild>
                      <button
                        onClick={async () => {
                          if (sessionWorkbench) {
                            // If session is not loaded, load it first
                            if (!isLoaded) {
                              await openSession(
                                recentSession.id,
                                recentSession.workspaceId,
                                recentSession.name
                              )
                            }
                            router.push(
                              `/workspaces/${recentSession.workspaceId}/sessions/${recentSession.id}`
                            )
                          }
                        }}
                        className={cn(
                          'group relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-200',
                          isActive
                            ? 'text-foreground-muted z-20 translate-y-[1px] rounded-t-md border-x border-t border-primary bg-primary/40 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] before:absolute before:bottom-0 before:left-[-12px] before:h-3 before:w-3 after:absolute after:bottom-0 after:right-[-12px] after:h-3 after:w-3'
                            : 'rounded-t-md border-x border-t border-muted text-accent/50 hover:bg-muted/5 hover:text-accent'
                        )}
                      >
                        <LaptopMinimal className="h-3.5 w-3.5 shrink-0" />
                        <span
                          className={cn(
                            'truncate',
                            recentSessions.length >= 3 ? 'max-w-16' : 'max-w-32'
                          )}
                        >
                          {getSessionDisplayName(recentSession.id)}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation()

                            if (isActive) {
                              router.push(
                                `/workspaces/${recentSession.workspaceId}`
                              )
                            }

                            // Also close iframe if it's loaded
                            if (isLoaded) {
                              closeIframe(recentSession.id)
                            }

                            removeFromRecent(recentSession.id, 'session')
                          }}
                          className="ml-1 cursor-pointer rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </button>
                    </HoverCardTrigger>
                    {sessionWorkbench && (
                      <HoverCardContent
                        className="glass-elevated w-72 p-0"
                        align="center"
                        sideOffset={12}
                      >
                        {renderSessionInfoHover(recentSession.id)}
                      </HoverCardContent>
                    )}
                  </HoverCard>
                )
              })}

              {/* Separator if both sessions and webapps */}
              {recentSessions.length > 0 && recentWebApps.length > 0 && (
                <div className="mx-2 h-6 w-px self-center bg-muted/30" />
              )}

              {/* Recent Web Apps */}
              {recentWebApps.map((recentWebApp) => {
                const isActive = activeIframeId === recentWebApp.id
                const isLoaded = cachedIframes.has(recentWebApp.id)

                return (
                  <div
                    key={recentWebApp.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      // If webapp is not loaded, load it first
                      if (!isLoaded) {
                        openWebApp(recentWebApp.id)
                      }
                      router.push(`/sessions/${recentWebApp.id}`)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (!isLoaded) {
                          openWebApp(recentWebApp.id)
                        }
                        router.push(`/sessions/${recentWebApp.id}`)
                      }
                    }}
                    className={cn(
                      'group relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-200',
                      isActive
                        ? 'z-20 translate-y-[1px] rounded-t-md border-x border-t border-muted bg-muted text-accent shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] before:absolute before:bottom-0 before:left-[-12px] before:h-3 before:w-3 after:absolute after:bottom-0 after:right-[-12px] after:h-3 after:w-3'
                        : 'rounded-t-md border-x border-t border-muted text-muted-foreground hover:bg-muted/5 hover:text-foreground'
                    )}
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span
                      className={cn(
                        'truncate',
                        recentSessions.length >= 3 ? 'max-w-16' : 'max-w-32'
                      )}
                    >
                      {recentWebApp.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()

                        if (isActive) {
                          router.push(`/workspaces/`)
                        }

                        // Also close iframe if it's loaded
                        if (isLoaded) {
                          closeIframe(recentWebApp.id)
                        }

                        removeFromRecent(recentWebApp.id, 'webapp')
                      }}
                      className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          {/* Search bar (disabled) */}
          {/* {user && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search..."
                disabled
                className="h-8 w-52 cursor-not-allowed rounded-lg border border-muted/50 bg-muted/20 pl-8 pr-3 text-sm text-muted-foreground/50 placeholder:text-muted-foreground/40"
              />
            </div>
          )} */}

          {user && (
            <button
              onClick={() => toggleRightSidebar()}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/30"
              title="Help"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {user && (
            <button
              onClick={() => router.push(`/notifications`)}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/30"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              {unreadNotificationsCount !== undefined &&
                unreadNotificationsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-contrast-background">
                    {unreadNotificationsCount > 99
                      ? '99+'
                      : unreadNotificationsCount}
                  </span>
                )}
            </button>
          )}
          <UserProfileSection />
        </div>

        <WorkbenchDeleteForm
          id={params.sessionId}
          state={[deleteOpen, setDeleteOpen]}
          onSuccess={() => {
            closeIframe(params.sessionId)
            removeFromRecent(params.sessionId, 'session')
            toast({
              title: 'Success!',
              description: 'Session is deleting, redirecting to workspace...',
              variant: 'default'
            })

            setTimeout(() => {
              refreshWorkbenches()
              setActiveIframe(null)
              router.replace(`/workspaces/${workspaceId}`)
            }, 2000)
          }}
        />

        {/* Delete dialog for header tabs */}
        {deleteSessionId && (
          <WorkbenchDeleteForm
            id={deleteSessionId}
            state={[!!deleteSessionId, () => setDeleteSessionId(null)]}
            onSuccess={() => {
              const session = workbenches?.find(
                (wb) => wb.id === deleteSessionId
              )
              router.push(`/workspaces/${workspaceId}`)
              refreshWorkbenches()

              // Remove from recent sessions bar and close iframe
              removeFromRecent(deleteSessionId, 'session')
              closeIframe(deleteSessionId)
              setDeleteSessionId(null)

              toast({
                title: 'Success!',
                description: `Session ${session?.name || ''} deleted`
              })
            }}
          />
        )}

        {currentWorkbench && (
          <WorkbenchUpdateForm
            state={[updateOpen, setUpdateOpen]}
            workbench={currentWorkbench}
            onSuccess={() => {}}
          />
        )}

        {/* Update dialog for header tabs */}
        {updateSessionId &&
          workbenches?.find((wb) => wb.id === updateSessionId) && (
            <WorkbenchUpdateForm
              state={[!!updateSessionId, () => setUpdateSessionId(null)]}
              workbench={workbenches.find((wb) => wb.id === updateSessionId)!}
              onSuccess={() => {
                refreshWorkbenches()
                setUpdateSessionId(null)
                toast({
                  title: 'Success!',
                  description: 'Session updated'
                })
              }}
            />
          )}
      </nav>

      <AlertDialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <AlertDialogContent className="glass-elevated">
          <AlertDialogHeader>
            <AlertDialogTitle>About {currentWorkbench?.name}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="cursor-default text-muted">
                  {/* Created by{' '}
                  {
                    users?.find((user) => user.id === currentWorkbench?.userId)
                      ?.firstName
                  }{' '}
                  {
                    users?.find((user) => user.id === currentWorkbench?.userId)
                      ?.lastName
                  }{' '} */}
                  {formatDistanceToNow(
                    currentWorkbench?.createdAt || new Date()
                  )}{' '}
                  ago
                </p>
              </div>
              {currentWorkbench?.description && (
                <p className="text-sm">{currentWorkbench?.description}</p>
              )}
              <div className="text-sm">
                Workspace:{' '}
                {
                  workspaces?.find((workspace) => workspace.id === workspaceId)
                    ?.name
                }
              </div>
              <div className="text-sm">
                Apps running:{' '}
                {(() => {
                  const filteredApps =
                    appInstances
                      ?.filter(
                        (instance: AppInstance) =>
                          instance.workbenchId === background?.sessionId
                      )
                      ?.map(
                        (instance: AppInstance) =>
                          apps?.find((app) => app.id === instance.appId)?.name
                      )
                      ?.filter(Boolean) || []
                  return (
                    filteredApps.join(', ') ||
                    currentWorkbench?.name ||
                    'No apps running'
                  )
                })()}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
