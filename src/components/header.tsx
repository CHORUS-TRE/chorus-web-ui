'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  CircleHelp,
  FlaskConical,
  LogOut,
  Search,
  Settings,
  User
} from 'lucide-react'
import { AppWindow } from 'lucide-react'
import { Maximize, PackageOpen, Plus, Trash2 } from 'lucide-react'
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
import { useIframeCache } from '@/providers/iframe-cache-provider'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import { Input } from '~/components/ui/input'

import { WorkbenchDeleteForm } from './forms/workbench-delete-form'
import { WorkbenchUpdateForm } from './forms/workbench-update-form'
import { toast } from './hooks/use-toast'
import { ThemeToggle } from './theme-toggle'
import { NavigationMenu, NavigationMenuList } from './ui/navigation-menu'
import { NavigationMenuItem } from './ui/navigation-menu'
import { NavigationMenuTrigger } from './ui/navigation-menu'
import { NavigationMenuContent } from './ui/navigation-menu'

export function Header() {
  const router = useRouter()
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    refreshWorkbenches,
    toggleRightSidebar,
    users,
    customLogos
  } = useAppState()
  const { background, setActiveIframe } = useIframeCache()
  const { user, logout } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const pathname = usePathname()
  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme } = useTheme()
  const defaultLogo = theme === 'light' ? logoBlack : logoWhite
  const logo = theme === 'light' ? customLogos.light : customLogos.dark

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
              width={54}
              className="ml-4 aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          )}
        </Link>

        {user && (
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Chorus</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-foreground">Dashboard</span>
            </div>

            {false && (
              <NavigationMenu>
                <NavigationMenuList>
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
                                <span className="hidden lg:block">
                                  Workspace
                                </span>
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
                                      document.getElementById(
                                        'workspace-iframe'
                                      )
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
            )}
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="bg-background/50 pl-8"
              />
            </div>
          </div>
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
              setActiveIframe(null)
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
