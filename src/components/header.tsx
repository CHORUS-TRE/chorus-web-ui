'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  Bell,
  CircleHelp,
  Database,
  FlaskConical,
  Home,
  LaptopMinimal,
  LogOut,
  Maximize,
  Package,
  PackageOpen,
  Plus,
  Settings,
  Store,
  Trash2,
  User
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu'

import { WorkbenchDeleteForm } from './forms/workbench-delete-form'
import { WorkbenchUpdateForm } from './forms/workbench-update-form'
import { toast } from './hooks/use-toast'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const router = useRouter()
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    background,
    setBackground,
    refreshWorkbenches,
    toggleRightSidebar,
    users
  } = useAppState()
  const { user, logout } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const pathname = usePathname()
  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])
  const [sessionView, setSessionView] = useState(isSessionPage)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme } = useTheme()
  const logo = theme === 'light' ? logoBlack : logoWhite

  const workspacesWithWorkbenches = useMemo(
    () =>
      workspaces?.filter((workspace) =>
        workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
      ),
    [workspaces, workbenches]
  )

  const sortedWorkspacesWithWorkbenches = useMemo(
    () =>
      workspacesWithWorkbenches?.sort((a) => (a.id === workspaceId ? 1 : 0)),
    [workspacesWithWorkbenches, workspaceId]
  )

  return (
    <>
      <nav
        className="flex h-11 min-w-full flex-nowrap items-center justify-between gap-2 border-b border-muted/40 bg-contrast-background/80 px-2 text-foreground shadow-lg backdrop-blur-sm"
        id="header"
        onMouseLeave={() => {
          setTimeout(() => {
            document.getElementById('workspace-iframe')?.focus()
          }, 1000)
        }}
      >
        <Link href="/" variant="muted">
          <Image
            src={logo}
            alt="Chorus"
            height={32}
            className="aspect-auto cursor-pointer"
            id="logo"
            priority
          />
        </Link>

        {user && (
          <>
            <NavigationMenu className="absolute left-1/2 flex -translate-x-1/2 transform items-center justify-start pt-1">
              <NavigationMenuList className="flex items-center justify-start gap-2 text-sm font-semibold text-muted transition-colors">
                <NavigationMenuItem>
                  <Link href={`/`} exact>
                    <div className="flex place-items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="hidden lg:block">Dashboard</span>
                    </div>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step3">
                  <NavigationMenuTrigger
                    onClick={() => router.push('/workspaces')}
                  >
                    <div className="flex place-items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className="hidden lg:block">Workspaces</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="glass-elevated text-muted">
                    <div className="w-[280px] space-y-1 p-2">
                      {/* All Workspaces Link */}
                      <div
                        className="interactive-item mb-2 overflow-hidden truncate whitespace-nowrap border-b border-muted/20 pb-2"
                        onClick={() => router.push('/workspaces')}
                      >
                        <Package className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">
                          All Workspaces
                        </span>
                      </div>

                      {/* Individual Workspaces */}
                      {workspaces
                        ?.filter((workspace) =>
                          user?.rolesWithContext?.some(
                            (role) => role.context.workspace === workspace.id
                          )
                        )
                        .map((workspace) => (
                          <div
                            key={workspace.id}
                            className={`interactive-item ${
                              workspace.id === workspaceId ? 'bg-accent/10' : ''
                            }`}
                            onClick={() =>
                              router.push(`/workspaces/${workspace.id}`)
                            }
                          >
                            {workspace.id === workspaceId ? (
                              <PackageOpen className="h-4 w-4 shrink-0" />
                            ) : (
                              <Package className="h-4 w-4 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm">
                                {workspace.name || workspace.shortName}
                              </div>
                              <div className="truncate text-xs">
                                {users?.find(
                                  (user) => user.id === workspace?.userId
                                )?.firstName +
                                  ' ' +
                                  users?.find(
                                    (user) => user.id === workspace?.userId
                                  )?.lastName || '#user-' + workspace?.userId}
                              </div>
                            </div>
                            {workspace.id === workspaceId && (
                              <div className="text-xs">Current</div>
                            )}
                          </div>
                        ))}

                      {(!workspaces || workspaces.length === 0) && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No workspaces available
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <div className="flex place-items-center gap-1 overflow-hidden truncate whitespace-nowrap">
                      <LaptopMinimal className="h-4 w-4" />
                      <span className="hidden lg:block">Sessions</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="glass-elevated text-foreground">
                    {sortedWorkspacesWithWorkbenches?.length === 0 && (
                      <div className="p-2 text-sm">No session found</div>
                    )}
                    <div className="glass-elevated flex max-h-[90vh] w-[640px] items-center justify-center gap-1 overflow-y-auto p-2">
                      <div>
                        {sortedWorkspacesWithWorkbenches
                          ?.slice(
                            0,
                            Math.ceil(
                              sortedWorkspacesWithWorkbenches.length / 2
                            )
                          )
                          .map((workspace) => (
                            <div
                              className="m-1 rounded-lg border border-muted/20 p-2"
                              key={`dock-${workspace.id}`}
                            >
                              <Link
                                href={`/workspaces/${workspace?.id}`}
                                className={`${workspace.id === workspaceId ? 'text-accent/80' : ''} `}
                                variant="underline"
                              >
                                <div
                                  className={`mb-1 flex items-center gap-2 overflow-hidden truncate text-ellipsis whitespace-nowrap text-sm font-semibold text-muted hover:text-foreground`}
                                >
                                  {workspace.id === workspaceId ? (
                                    <PackageOpen className="h-4 w-4" />
                                  ) : (
                                    <Package className="h-4 w-4" />
                                  )}
                                  {workspace?.name},{' '}
                                  {users?.find(
                                    (user) => user.id === workspace?.userId
                                  )?.username || '#user-' + workspace?.userId}
                                </div>
                              </Link>
                              <div className="text-sm">
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspace?.id
                                  )
                                  .map((workbench) => (
                                    <div
                                      className="mb-0 ml-2 h-full"
                                      key={`${workspace?.id}-${workbench.id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${workbench.id}`}
                                        variant="underline"
                                      >
                                        <div className="flex items-center gap-2 text-xs text-muted hover:text-foreground">
                                          <AppWindow className="h-4 w-4 shrink-0" />
                                          {appInstances
                                            ?.filter(
                                              (instance) =>
                                                workspace?.id ===
                                                instance.workspaceId
                                            )
                                            ?.filter(
                                              (instance) =>
                                                workbench.id ===
                                                instance.workbenchId
                                            )
                                            .map(
                                              (instance) =>
                                                apps?.find(
                                                  (app) =>
                                                    app.id === instance.appId
                                                )?.name || ''
                                            )
                                            .join(', ') ||
                                            workbench.name ||
                                            'No apps'}
                                        </div>
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                      <div>
                        {sortedWorkspacesWithWorkbenches
                          ?.slice(
                            Math.ceil(
                              sortedWorkspacesWithWorkbenches.length / 2
                            )
                          )
                          .map((workspace) => (
                            <div
                              className="m-1 rounded-lg border border-muted/20 p-2"
                              key={`dock-${workspace.id}`}
                            >
                              <Link
                                href={`/workspaces/${workspace?.id}`}
                                className={`${workspace.id === workspaceId ? 'text-accent/80' : ''} `}
                                variant="underline"
                              >
                                <div
                                  className={`mb-1 flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground`}
                                >
                                  {workspace.id === workspaceId ? (
                                    <PackageOpen className="h-4 w-4" />
                                  ) : (
                                    <Package className="h-4 w-4" />
                                  )}
                                  {workspace?.name},{' '}
                                  {users?.find(
                                    (user) => user.id === workspace?.userId
                                  )?.username || '#user-' + workspace?.userId}
                                </div>
                              </Link>
                              <div className="text-sm">
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspace?.id
                                  )
                                  .map((workbench) => (
                                    <div
                                      className="mb-0 ml-2 h-full"
                                      key={`${workspace?.id}-${workbench.id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${workbench.id}`}
                                        variant="underline"
                                      >
                                        <div className="flex items-center gap-2 text-xs text-muted hover:text-foreground">
                                          <AppWindow className="h-4 w-4 shrink-0" />
                                          {appInstances
                                            ?.filter(
                                              (instance) =>
                                                workspace?.id ===
                                                instance.workspaceId
                                            )
                                            ?.filter(
                                              (instance) =>
                                                workbench.id ===
                                                instance.workbenchId
                                            )
                                            .map(
                                              (instance) =>
                                                apps?.find(
                                                  (app) =>
                                                    app.id === instance.appId
                                                )?.name || ''
                                            )
                                            .join(', ') ||
                                            workbench.name ||
                                            'No apps'}
                                        </div>
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step4">
                  <Link
                    href={`/data`}
                    className="overflow-hidden truncate text-ellipsis whitespace-nowrap"
                  >
                    <div className="flex place-items-center gap-1">
                      <Database className="h-4 w-4" />
                      <span className="hidden lg:block">Data</span>
                    </div>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/app-store"
                    className="overflow-hidden truncate text-ellipsis whitespace-nowrap"
                  >
                    <div className="flex place-items-center gap-1">
                      <Store className="h-4 w-4" />
                      <span className="hidden lg:block">App Store</span>
                    </div>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  {background?.sessionId && workbenches && (
                    <>
                      <NavigationMenuTrigger
                        onClick={() => {
                          if (!isSessionPage) {
                            router.push(
                              `/workspaces/${workspaceId}/sessions/${background?.sessionId}`
                            )
                          } else {
                            router.push(`/workspaces/${workspaceId}`)
                          }
                        }}
                      >
                        <div className="flex-start flex place-items-center gap-1">
                          {isSessionPage ? (
                            <>
                              <AppWindow className="h-4 w-4" />
                              <span className="hidden lg:block">Session</span>
                            </>
                          ) : (
                            <>
                              <PackageOpen className="h-4 w-4" />
                              <span className="hidden lg:block">Workspace</span>
                            </>
                          )}
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="glass-elevated text-muted-foreground">
                        <div className="w-[240px] space-y-1 p-2">
                          <div className="mb-1 space-y-0.5 border-b border-muted/20 pb-2">
                            {/* <div
                              className={`interactive-item mb-1 overflow-hidden truncate whitespace-nowrap ${!isSessionPage ? 'bg-accent' : ''}`}
                              onClick={() =>
                                router.push(`/workspaces/${workspaceId}`)
                              }
                            >
                              <Package className="h-4 w-4 shrink-0" />
                              <span className="text-sm font-medium">
                                {
                                  workspaces?.find(
                                    (workspace) => workspace.id === workspaceId
                                  )?.name
                                }
                                {!isSessionPage ? 'Current Workspace' : ''}
                              </span>
                            </div>
                            <div
                              className={`interactive-item mb-2 pb-3 ${isSessionPage ? 'bg-accent' : ''}`}
                              onClick={() =>
                                router.push(
                                  `/workspaces/${workspaceId}/sessions/${background?.sessionId}`
                                )
                              }
                            >
                              <LaptopMinimal className="h-4 w-4 shrink-0" />
                              <span className="text-sm font-medium">
                                {(() => {
                                  const filteredApps =
                                    appInstances
                                      ?.filter(
                                        (instance) =>
                                          instance.workbenchId ===
                                          background?.sessionId
                                      )
                                      ?.map(
                                        (instance) =>
                                          apps?.find(
                                            (app) => app.id === instance.appId
                                          )?.name
                                      )
                                      ?.filter(Boolean) || []
                                  return (
                                    filteredApps.join(', ') ||
                                    currentWorkbench?.name ||
                                    'No apps running'
                                  )
                                })()}
                              </span>
                            </div> */}

                            <div className="mb-1">
                              <div
                                className="interactive-item"
                                onClick={() => router.push(`/app-store`)}
                              >
                                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Start New App</span>
                              </div>

                              <div
                                className="interactive-item"
                                onClick={() => setUpdateOpen(true)}
                              >
                                <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Settings</span>
                              </div>

                              <div
                                className="interactive-item"
                                onClick={() => {
                                  const iframe =
                                    document.getElementById('workspace-iframe')
                                  if (iframe) {
                                    iframe.requestFullscreen()
                                  }
                                }}
                              >
                                <Maximize className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">
                                  Toggle Fullscreen
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mb-1">
                            <div
                              className="interactive-item items-start"
                              onClick={() => setShowAboutDialog(true)}
                            >
                              <AppWindow className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm">Session Info</div>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-muted/20 pt-1">
                            <div
                              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                              onClick={() => setDeleteOpen(true)}
                            >
                              <Trash2 className="h-4 w-4 shrink-0" />
                              <span className="text-sm">Delete Session</span>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </>
        )}

        <div className="flex items-center justify-end">
          <div className="ml-1 flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={toggleRightSidebar}
              aria-label="Help and support"
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Help</span>
            </Button>
            {user?.rolesWithContext?.some((role) => role.context.user) && (
              <Button
                variant="ghost"
                onClick={() => router.push(`/lab`)}
                aria-label="Sandbox"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Lab</span>
              </Button>
            )}
            {user && (
              <Button variant="ghost" aria-label="Notifications" disabled>
                <Bell className="h-4 w-4 text-muted" aria-hidden="true" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="glass-elevated w-56"
                  align="end"
                  forceMount
                >
                  <>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => router.push(`/users/${user?.id}`)}
                    >
                      <User className="h-4 w-4" />
                      {user?.firstName} {user?.lastName} profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/admin')}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-slate-500" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <WorkbenchDeleteForm
          id={params.sessionId}
          state={[deleteOpen, setDeleteOpen]}
          onSuccess={() => {
            toast({
              title: 'Success!',
              description: 'Session is deleting, redirecting to workspace...',
              variant: 'default'
            })

            setTimeout(() => {
              refreshWorkbenches()
              setBackground(undefined)
              router.replace(`/workspaces/${workspaceId}`)
            }, 2000)
          }}
        />

        <AppInstanceCreateForm
          state={[createOpen, setCreateOpen]}
          sessionId={params.sessionId}
          userId={user?.id}
          workspaceId={params.workspaceId}
        />

        {currentWorkbench && (
          <WorkbenchUpdateForm
            state={[updateOpen, setUpdateOpen]}
            workbench={currentWorkbench}
            onSuccess={() => {}}
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
                  Created by{' '}
                  {
                    users?.find((user) => user.id === currentWorkbench?.userId)
                      ?.firstName
                  }{' '}
                  {
                    users?.find((user) => user.id === currentWorkbench?.userId)
                      ?.lastName
                  }{' '}
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
                        (instance) =>
                          instance.workbenchId === background?.sessionId
                      )
                      ?.map(
                        (instance) =>
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
