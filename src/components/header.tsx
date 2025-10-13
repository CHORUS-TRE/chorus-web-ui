'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  Bell,
  CircleHelp,
  Database,
  Home,
  LaptopMinimal,
  LogOut,
  Maximize,
  Package,
  PackageOpen,
  Plus,
  Search,
  Settings,
  Store,
  Trash2,
  User,
  Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
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
import NavLink from './nav-link'
import { Input } from './ui/input'

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
  const pathname = usePathname()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )

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

  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])

  return (
    <>
      <nav
        className="relative flex h-11 min-w-full flex-wrap items-center justify-between gap-2 bg-black bg-opacity-85 px-4 py-1 text-slate-100 shadow-lg backdrop-blur-sm md:flex-nowrap"
        id="header"
        onMouseLeave={() => {
          setTimeout(() => {
            document.getElementById('iframe')?.focus()
          }, 1000)
        }}
      >
        <div className="flex min-w-0 flex-shrink flex-nowrap items-center justify-start">
          <NavLink href="/">
            <Image
              src={logo}
              alt="Chorus"
              height={32}
              className="aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          </NavLink>
        </div>
        {user && (
          <>
            <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
              <NavigationMenuList className="flex items-center justify-center gap-3">
                <NavigationMenuItem>
                  {background?.sessionId && workbenches && (
                    <>
                      <NavigationMenuTrigger className="inline-flex w-max items-center justify-center border-b-2 border-none border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-none hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent">
                        <div className="flex place-items-center gap-1">
                          {workspaceId && workspaceId === user?.workspaceId ? (
                            <AppWindow className="h-4 w-4 text-white" />
                          ) : (
                            <AppWindow className="h-4 w-4" />
                          )}
                          {
                            workspaces?.find(
                              (w) => w.id === background?.workspaceId
                            )?.name
                          }
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="border border-muted/20 bg-black bg-opacity-95 text-white shadow-xl">
                        <div className="w-[240px] p-2">
                          {/* Workspace Navigation */}
                          <div className="mb-1">
                            <div className="space-y-0.5">
                              {isSessionPage ? (
                                <div
                                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                  onClick={() =>
                                    router.push(`/workspaces/${workspaceId}`)
                                  }
                                >
                                  <Home className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  <span className="text-sm">
                                    Workspace Home
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                  onClick={() =>
                                    router.push(
                                      `/workspaces/${workspaceId}/sessions/${background?.sessionId}`
                                    )
                                  }
                                >
                                  <LaptopMinimal className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  <span className="text-sm">
                                    Workspace Session
                                  </span>
                                </div>
                              )}

                              <div
                                className="ml-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() =>
                                  router.push(
                                    `/workspaces/${workspaceId}/sessions`
                                  )
                                }
                              >
                                <LaptopMinimal className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Sessions</span>
                              </div>

                              <div
                                className="ml-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() =>
                                  router.push(
                                    `/workspaces/${workspaceId}/users`
                                  )
                                }
                              >
                                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Team</span>
                              </div>

                              <div
                                className="ml-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() =>
                                  router.push(`/workspaces/${workspaceId}/data`)
                                }
                              >
                                <Database className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Data</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mb-1 border-t border-muted/20 pt-2">
                            <div className="space-y-0.5">
                              <div
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() => router.push(`/app-store`)}
                              >
                                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Start New App</span>
                              </div>

                              <div
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() => setUpdateOpen(true)}
                              >
                                <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm">Settings</span>
                              </div>

                              <div
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                                onClick={() => {
                                  const iframe =
                                    document.getElementById('iframe')
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

                          {/* About this session */}
                          <div className="mb-1">
                            <div
                              className="flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10"
                              onClick={() => setShowAboutDialog(true)}
                            >
                              <AppWindow className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm">Session Info</div>
                                <div className="text-xs text-muted-foreground">
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
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Danger Zone */}
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
                  {!background?.sessionId && workspaceId && (
                    <NavLink
                      href={
                        workspaces?.find((w) => w.id === user?.workspaceId)
                          ? `/workspaces/${user?.workspaceId}`
                          : workspaceId && workspaceId !== user?.workspaceId
                            ? `/workspaces/${workspaceId}`
                            : '/'
                      }
                      className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                      exact={user?.workspaceId === workspaceId}
                    >
                      <div className="flex place-items-center gap-1">
                        {user?.workspaceId === background?.workspaceId ? (
                          <Home className="h-4 w-4" />
                        ) : (
                          <AppWindow className="h-4 w-4" />
                        )}
                        {
                          workspaces?.find((w) => w.id === user?.workspaceId)
                            ?.name
                        }
                      </div>
                    </NavLink>
                  )}
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step3">
                  <NavigationMenuTrigger className="inline-flex w-max items-center justify-center border-b-2 border-none border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-none hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent">
                    <div className="flex place-items-center gap-1">
                      <Package className="h-4 w-4" />
                      Workspaces
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-muted/20 bg-black bg-opacity-95 text-white shadow-xl">
                    <div className="w-[280px] p-2">
                      <div className="space-y-1">
                        {/* All Workspaces Link */}
                        <div
                          className="mb-2 flex cursor-pointer items-center gap-2 rounded border-b border-muted/20 px-2 py-1.5 pb-2 transition-colors hover:bg-accent/10"
                          onClick={() => router.push('/workspaces')}
                        >
                          <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            All Workspaces
                          </span>
                        </div>

                        {/* Individual Workspaces */}
                        {workspaces
                          ?.filter((workspace) => workspace.userId === user?.id)
                          .map((workspace) => (
                            <div
                              key={workspace.id}
                              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10 ${
                                workspace.id === workspaceId
                                  ? 'bg-accent/10'
                                  : ''
                              }`}
                              onClick={() =>
                                router.push(`/workspaces/${workspace.id}`)
                              }
                            >
                              {workspace.id === workspaceId ? (
                                <PackageOpen className="h-4 w-4 shrink-0 text-accent" />
                              ) : (
                                <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm">
                                  {workspace.id === user?.workspaceId
                                    ? 'My Workspace'
                                    : workspace.name || workspace.shortName}
                                </div>
                                {workspace.description && (
                                  <div className="truncate text-xs text-muted-foreground">
                                    {workspace.description}
                                  </div>
                                )}
                              </div>
                              {workspace.id === workspaceId && (
                                <div className="text-xs text-accent">
                                  Current
                                </div>
                              )}
                            </div>
                          ))}

                        {(!workspaces || workspaces.length === 0) && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No workspaces available
                          </div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href={`/data`}
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="flex place-items-center gap-1">
                      <Database className="h-4 w-4" />
                      Data
                    </div>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href="/app-store"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="flex place-items-center gap-1">
                      <Store className="h-4 w-4" />
                      App Store
                    </div>
                  </NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="inline-flex w-max items-center justify-center border-b-2 border-none border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-none hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent">
                    <div className="flex place-items-center gap-1">
                      <LaptopMinimal className="h-4 w-4" />
                      <span>Open Sessions</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                    {sortedWorkspacesWithWorkbenches?.length === 0 && (
                      <div className="p-2 text-sm">No session found</div>
                    )}
                    <div className="flex max-h-[90vh] w-[640px] gap-1 overflow-y-auto bg-black bg-opacity-85 p-2">
                      <div className="flex flex-1 flex-col gap-1">
                        {sortedWorkspacesWithWorkbenches
                          ?.slice(
                            0,
                            Math.ceil(
                              sortedWorkspacesWithWorkbenches.length / 2
                            )
                          )
                          .map((workspace) => (
                            <div
                              className="mb-0 p-2"
                              key={`dock-${workspace.id}`}
                            >
                              <Link
                                href={`/workspaces/${workspace?.id}`}
                                className={`text-muted hover:text-accent ${workspace.id === workspaceId ? 'text-accent/80' : ''}`}
                              >
                                <div
                                  className={`mb-1 flex items-center gap-2 font-semibold`}
                                >
                                  {workspace.id === workspaceId ? (
                                    <PackageOpen className="h-4 w-4" />
                                  ) : (
                                    <Package className="h-4 w-4" />
                                  )}
                                  {workspace?.id === user?.workspaceId
                                    ? 'My Workspace'
                                    : workspace?.shortName}
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
                                      className="mb-1 h-full"
                                      key={`${workspace?.id}-${workbench.id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${workbench.id}`}
                                        className={`flex h-full flex-col rounded-lg border border-muted/40 bg-background/40 p-2 text-white transition-colors duration-300 hover:border-accent hover:shadow-lg`}
                                      >
                                        <div className="text-sm font-semibold">
                                          {/* <div className="flex items-center justify-between">
                                            <div
                                              className={`mb-1 flex items-center gap-2 text-white ${id === background?.sessionId ? 'text-accent' : ''}`}
                                            >
                                              <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                                              {shortName}
                                            </div>
                                            <p className="text-xs text-muted">
                                              {formatDistanceToNow(
                                                createdAt ?? new Date()
                                              )}{' '}
                                              ago
                                            </p>
                                          </div> */}
                                          <div className="text-xs text-muted">
                                            <div className="flex items-center gap-2 text-xs">
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
                                                        app.id ===
                                                        instance.appId
                                                    )?.name || ''
                                                )
                                                .join(', ') ||
                                                workbench.name ||
                                                'No apps'}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-auto"></div>
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        {sortedWorkspacesWithWorkbenches
                          ?.slice(
                            Math.ceil(
                              sortedWorkspacesWithWorkbenches.length / 2
                            )
                          )
                          .map((workspace) => (
                            <div
                              className="mb-0 p-2"
                              key={`dock-${workspace.id}`}
                            >
                              <Link
                                href={`/workspaces/${workspace?.id}`}
                                className={`text-muted hover:text-accent ${workspace.id === workspaceId ? 'text-accent/80' : ''}`}
                              >
                                <div
                                  className={`mb-1 flex items-center gap-2 font-semibold`}
                                >
                                  {workspace.id === workspaceId ? (
                                    <PackageOpen className="h-4 w-4" />
                                  ) : (
                                    <Package className="h-4 w-4" />
                                  )}
                                  {workspace?.id === user?.workspaceId
                                    ? 'Home'
                                    : workspace?.shortName}
                                </div>
                              </Link>
                              <div className="pl-1 text-sm">
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspace?.id
                                  )
                                  .map((workbench) => (
                                    <div
                                      className="mb-1 h-full"
                                      key={`${workspace?.id}-${workbench.id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${workbench.id}`}
                                        className={`flex h-full flex-col rounded-lg border border-muted/40 bg-background/40 p-2 text-white transition-colors duration-300 hover:border-accent hover:shadow-lg`}
                                      >
                                        <div className="text-sm font-semibold">
                                          {/* <div className="flex items-center justify-between">
                                            <div
                                              className={`mb-1 flex items-center gap-2 text-white ${id === background?.sessionId ? 'text-accent' : ''}`}
                                            >
                                              <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                                              {shortName}
                                            </div>
                                            <p className="text-xs text-muted">
                                              {formatDistanceToNow(createdAt)}{' '}
                                              ago
                                            </p>
                                          </div> */}
                                          <div className="text-xs text-muted">
                                            <div className="flex items-center gap-2 text-xs">
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
                                                        app.id ===
                                                        instance.appId
                                                    )?.name || ''
                                                )
                                                .join(', ') ||
                                                workbench.name ||
                                                'No apps'}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-auto"></div>
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
                {/* <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href="/admin"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="flex place-items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Admin
                    </div>
                  </NavLink>
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>
          </>
        )}

        <div className="flex items-center justify-end">
          {user && (
            <div className="relative mr-2 hidden flex-1 xl:block">
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted" />
              <Input
                disabled
                type="search"
                placeholder="Find workspaces, apps, content ..."
                className="h-7 w-full border border-muted/40 bg-background pl-8 md:w-[240px] lg:w-[240px]"
                id="search-input"
              />
            </div>
          )}
          <div className="ml-1 flex items-center">
            <Button
              size="icon"
              className="h-8 w-8 text-muted hover:bg-inherit hover:text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
              variant="ghost"
              onClick={toggleRightSidebar}
              aria-label="Help and support"
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Help</span>
            </Button>
            {user && (
              <Button
                size="icon"
                className="h-8 w-8 overflow-hidden text-muted hover:bg-inherit hover:text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
                variant="ghost"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="h-8 w-8 overflow-hidden text-muted hover:bg-inherit hover:text-accent"
                    variant="ghost"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-black bg-opacity-85 text-white"
                  align="end"
                  forceMount
                >
                  <>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => router.push('/users/me')}
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
        <AlertDialogContent className="bg-black bg-opacity-85 text-white">
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
