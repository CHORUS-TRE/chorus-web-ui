'use client'
import { formatDistance } from 'date-fns'
import {
  AppWindow,
  CircleHelp,
  House,
  LaptopMinimal,
  Menu,
  Package,
  PackageOpen,
  Search,
  Store,
  User
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import userPlaceholder from '/public/placeholder-user.jpg'
import { logout } from '@/components/actions/authentication-view-model'
import { getAuthenticationModes } from '@/components/actions/authentication-view-model'
import { useAppState } from '@/components/store/app-state-context'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Avatar } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AuthenticationModeType } from '@/domain/model/authentication'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu'
import { AuthenticationMode, Workbench } from '~/domain/model'

import {
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import NavLink from './nav-link'
import { useAuth } from './store/auth-context'
import { Input } from './ui/input'

interface BreadcrumbItem {
  name: string
  href?: string
}

export function Header() {
  const router = useRouter()
  const paths = usePathname()
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    setNotification,
    background,
    setBackground,
    refreshWorkbenches,
    toggleRightSidebar
  } = useAppState()
  const { user, isAuthenticated, setAuthenticated } = useAuth()

  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId
  const [currentWorkbench, setCurrentWorkbench] = useState<Workbench>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [authModes, setAuthModes] = useState<AuthenticationMode[]>([])

  const isInAppContext = params?.workspaceId && params?.sessionId
  const isUserWorkspace = params?.workspaceId === user?.workspaceId

  const pathNames = useMemo(
    () => paths?.split('/').filter(Boolean) || [],
    [paths]
  )

  const internalLogin = authModes.some(
    (mode) =>
      mode.type === AuthenticationModeType.INTERNAL && mode.internal?.enabled
  )

  const handleLogoutClick = async () => {
    setBackground(undefined)
    setAuthenticated(false)
    logout().then(() => {
      window.location.href = '/'
    })
  }

  // Utility function for capitalizing
  const capitalize = useCallback(
    (str: string) =>
      str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    []
  )

  // Generate initial breadcrumb items
  const initialItems = useMemo(
    () =>
      pathNames.map((path, i) => ({
        name: capitalize(path),
        href: pathNames.slice(0, i + 1).join('/')
      })),
    [pathNames, capitalize]
  )

  // Handle data fetching and updates
  const updateBreadcrumbItems = useCallback(async () => {
    const updatedItems: BreadcrumbItem[] = [...initialItems]

    if (params?.workspaceId) {
      const workspace = workspaces?.find((w) => w.id === params.workspaceId)
      if (workspace?.shortName) {
        updatedItems[1] = {
          ...updatedItems[1],
          name:
            params.workspaceId === user?.workspaceId
              ? 'Home'
              : workspace.shortName
        }

        if (params?.sessionId) {
          const workbench = workbenches?.find((w) => w.id === params.sessionId)
          if (workbench?.shortName) {
            updatedItems[3] = {
              ...updatedItems[3],
              name: workbench.shortName
            }
          }
        }
      }
    }

    setItems(updatedItems)
  }, [
    initialItems,
    params?.workspaceId,
    params?.sessionId,
    workbenches,
    workspaces,
    user?.workspaceId
  ])

  useEffect(() => {
    setItems(initialItems)
    updateBreadcrumbItems()
  }, [updateBreadcrumbItems, initialItems])

  useEffect(() => {
    if (isInAppContext && workbenches) {
      const workbench = workbenches.find((w) => w.id === params.sessionId)
      if (workbench) {
        setCurrentWorkbench(workbench)
      }
    }
  }, [isInAppContext, workbenches, params.sessionId])

  useEffect(() => {
    if (isAuthenticated) return

    const fetchAuthModes = async () => {
      try {
        const response = await getAuthenticationModes()
        setAuthModes(response.data || [])
      } catch (error) {
        setNotification({
          title: 'Error fetching auth modes:',
          description:
            error instanceof Error
              ? error.message
              : 'Please retry later or contact support',
          variant: 'destructive'
        })
        console.error('Error fetching auth modes:', error)
      }
    }

    fetchAuthModes()
  }, [setNotification, isAuthenticated])

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
          <NavLink href="/" className="">
            <Image
              src={logo}
              alt="Chorus"
              height={32}
              className="aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          </NavLink>
          {isAuthenticated && (
            <div className="min-w-0 flex-1 pr-4">
              <Breadcrumb className="pl-2">
                <BreadcrumbList className="text-primary-foreground">
                  {paths && paths.length > 1 && (
                    <BreadcrumbSeparator className="text-muted" />
                  )}
                  {items.map((item, index) => (
                    <Fragment key={item.href}>
                      {/* Workspace Menu  Dropdown */}
                      {index === 0 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger className="ml-1 mt-[2px] border-b-2 border-transparent text-sm font-light text-white hover:border-b-2 hover:border-accent">
                                <span
                                  onClick={() => {
                                    router.push('/workspaces')
                                  }}
                                >
                                  Workspaces
                                </span>
                              </NavigationMenuTrigger>
                              <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                  {workspaces?.map((workspace) => (
                                    <NavigationMenuItem
                                      key={`my-workspace-${workspace.id}`}
                                      className="group/workspace relative"
                                    >
                                      <ListItem
                                        className="p-1 font-semibold"
                                        href="#"
                                        onClick={() => {
                                          router.push(
                                            `/workspaces/${workspace.id}`
                                          )
                                        }}
                                        wrapWithLi={false}
                                      >
                                        <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                          <div
                                            className={`flex items-center gap-2 ${workspace.id === workspaceId ? 'text-accent' : ''}`}
                                          >
                                            {workspace.id === workspaceId ||
                                            paths === '/' ? (
                                              <PackageOpen className="h-4 w-4" />
                                            ) : (
                                              <Package className="h-4 w-4" />
                                            )}
                                            {workspace?.id === user?.workspaceId
                                              ? 'Home'
                                              : workspace?.shortName}
                                          </div>
                                          <span className="text-sm font-semibold leading-snug text-muted">
                                            {(() => {
                                              const w =
                                                workbenches?.filter(
                                                  (workbench) =>
                                                    workbench.workspaceId ===
                                                    workspace.id
                                                )?.length || 0
                                              return `${w} open ${w <= 1 ? 'session' : 'sessions'}`
                                            })()}
                                          </span>
                                        </div>
                                      </ListItem>
                                    </NavigationMenuItem>
                                  ))}
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}

                      {/* Workspace's sessions Menu  Dropdown*/}
                      {index === 1 && (
                        <NavigationMenu className="hidden xl:block">
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                className="ml-1 mt-[2px] border-b-2 text-sm font-light text-white hover:border-b-2 hover:border-accent"
                                onClick={() => {
                                  router.push(`/workspaces/${workspaceId}`)
                                }}
                              >
                                <span>{item.name}</span>
                              </NavigationMenuTrigger>
                              {workbenches &&
                                workbenches.filter(
                                  (workbench) =>
                                    workbench.workspaceId === workspaceId
                                ).length > 0 && (
                                  <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                    <div className="flex w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                      <div className="flex flex-1 flex-col gap-1">
                                        {workbenches
                                          ?.filter(
                                            (workbench) =>
                                              workbench.workspaceId ===
                                              workspaceId
                                          )
                                          .slice(
                                            0,
                                            Math.ceil(workbenches.length / 2)
                                          )
                                          .map((workbench) => (
                                            <NavigationMenuItem
                                              key={workbench.id}
                                              className="group/session relative"
                                            >
                                              <ListItem
                                                className="p-1 font-semibold"
                                                onClick={() => {
                                                  router.push(
                                                    `/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`
                                                  )
                                                }}
                                                href="#"
                                                wrapWithLi={false}
                                              >
                                                <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                                  {/* <div
                                                    className={`mb-[2px] flex items-center gap-2 ${workbench.id === background?.sessionId ? 'text-accent' : ''}`}
                                                  >
                                                    <LaptopMinimal className="h-4 w-4" />
                                                    {workbench.name}
                                                  </div> */}
                                                  <span className="text-sm font-semibold leading-snug">
                                                    {(() => {
                                                      const filteredApps =
                                                        appInstances
                                                          ?.filter(
                                                            (instance) =>
                                                              instance.sessionId ===
                                                              workbench.id
                                                          )
                                                          ?.map(
                                                            (instance) =>
                                                              apps?.find(
                                                                (app) =>
                                                                  app.id ===
                                                                  instance.appId
                                                              )?.name
                                                          )
                                                          ?.filter(Boolean) ||
                                                        []

                                                      return (
                                                        <div className="flex items-center gap-2 text-xs">
                                                          <AppWindow className="h-4 w-4 shrink-0" />
                                                          {filteredApps.join(
                                                            ', '
                                                          )}
                                                        </div>
                                                      )
                                                    })()}
                                                  </span>
                                                </div>
                                              </ListItem>
                                            </NavigationMenuItem>
                                          ))}
                                      </div>
                                      <div className="flex flex-1 flex-col gap-1">
                                        {workbenches
                                          ?.filter(
                                            (workbench) =>
                                              workbench.workspaceId ===
                                              workspaceId
                                          )
                                          .slice(
                                            Math.ceil(workbenches.length / 2)
                                          )
                                          .map((workbench) => (
                                            <NavigationMenuItem
                                              key={workbench.id}
                                              className="group/session relative"
                                            >
                                              <ListItem
                                                className="p-1 font-semibold"
                                                href={`/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`}
                                                wrapWithLi={false}
                                              >
                                                <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                                  <div
                                                    className={`mb-[2px] flex items-center gap-2 ${workbench.id === background?.sessionId ? 'text-accent' : ''}`}
                                                  >
                                                    <LaptopMinimal className="h-4 w-4" />
                                                    {workbench.name}
                                                  </div>
                                                  <span className="text-sm font-semibold leading-snug text-muted">
                                                    {(() => {
                                                      const filteredApps =
                                                        appInstances
                                                          ?.filter(
                                                            (instance) =>
                                                              instance.sessionId ===
                                                              workbench.id
                                                          )
                                                          ?.map(
                                                            (instance) =>
                                                              apps?.find(
                                                                (app) =>
                                                                  app.id ===
                                                                  instance.appId
                                                              )?.name
                                                          )
                                                          ?.filter(Boolean) ||
                                                        []

                                                      return (
                                                        <div className="flex items-center gap-2 text-xs">
                                                          <AppWindow className="h-4 w-4 shrink-0" />
                                                          {filteredApps.join(
                                                            ', '
                                                          )}
                                                        </div>
                                                      )
                                                    })()}
                                                  </span>
                                                </div>
                                              </ListItem>
                                            </NavigationMenuItem>
                                          ))}
                                      </div>
                                    </div>
                                  </NavigationMenuContent>
                                )}
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}

                      {/* Session Menu */}
                      {index === 2 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            {isInAppContext && currentWorkbench && (
                              <NavigationMenuItem>
                                <NavigationMenuTrigger className="ml-1 border-b-2 border-accent text-sm font-light text-white hover:border-b-2 hover:border-accent">
                                  <span className="mt-1 flex items-center gap-2">
                                    <LaptopMinimal className="h-4 w-4" />
                                    <span>Current session</span>
                                  </span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                  <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                    {/* Session Info Section */}
                                    <NavigationMenuItem>
                                      <ListItem
                                        title={`About this session`}
                                        className="p-1 font-semibold"
                                        onClick={() => setShowAboutDialog(true)}
                                        wrapWithLi={false}
                                      >
                                        <div className="pl-1 text-xs font-semibold">
                                          {(() => {
                                            const filteredApps =
                                              appInstances
                                                ?.filter(
                                                  (instance) =>
                                                    instance.sessionId ===
                                                    currentWorkbench.id
                                                )
                                                ?.map(
                                                  (instance) =>
                                                    apps?.find(
                                                      (app) =>
                                                        app.id ===
                                                        instance.appId
                                                    )?.name
                                                )
                                                ?.filter(Boolean) || []

                                            return (
                                              <div className="flex items-center gap-2 text-xs">
                                                <AppWindow className="h-4 w-4 shrink-0" />
                                                {filteredApps.join(', ')}
                                              </div>
                                            )
                                          })()}
                                        </div>
                                      </ListItem>
                                    </NavigationMenuItem>
                                    <Separator className="m-1" />
                                    {/* Settings Section */}
                                    <ListItem
                                      title="Settings..."
                                      className="cursor-pointer p-1 font-semibold hover:bg-accent"
                                      onClick={() => setUpdateOpen(true)}
                                      wrapWithLi={false}
                                    ></ListItem>

                                    {/* Start New App Section */}
                                    <ListItem
                                      title="Start New App..."
                                      className="cursor-pointer p-1 font-semibold hover:bg-accent"
                                      onClick={() => {
                                        router.push(`/app-store`)
                                      }}
                                      wrapWithLi={false}
                                    ></ListItem>
                                    <Separator className="m-1" />
                                    {/* Fullscreen Section */}
                                    <ListItem
                                      title="Toggle Fullscreen"
                                      className="cursor-pointer p-1 font-semibold hover:bg-accent"
                                      onClick={() => {
                                        const iframe =
                                          document.getElementById('iframe')
                                        if (iframe) {
                                          iframe.requestFullscreen()
                                        }
                                      }}
                                      wrapWithLi={false}
                                    ></ListItem>

                                    <Separator className="m-1" />

                                    {/* Quit Section */}
                                    <ListItem
                                      title="Delete Session..."
                                      className="cursor-pointer p-1 font-semibold"
                                      onClick={() => setDeleteOpen(true)}
                                      wrapWithLi={false}
                                    ></ListItem>
                                  </ul>
                                </NavigationMenuContent>
                              </NavigationMenuItem>
                            )}
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <>
            <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
              <NavigationMenuList className="flex items-center justify-center gap-3">
                {/* <NavigationMenuItem id="getting-started-step-home">
                  <NavLink
                    href="/"
                    exact={!isUserWorkspace}
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex place-items-center gap-2">
                      <House className="h-4 w-4" />
                      Home
                    </div>
                  </NavLink>
                </NavigationMenuItem> */}
                <NavigationMenuItem id="getting-started-step3">
                  <NavLink
                    href="/workspaces"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    exact={isUserWorkspace}
                  >
                    <div className="mt-1 flex place-items-center gap-1">
                      <Package className="h-4 w-4" />
                      Workspaces
                    </div>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href="/app-store"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex place-items-center gap-1">
                      <Store className="h-4 w-4" />
                      App Store
                    </div>
                  </NavLink>
                </NavigationMenuItem>
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="mt-[2px] flex place-items-center gap-1">
                    <LaptopMinimal className="h-4 w-4" />
                    <span>Sessions</span>
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
                                className={`text-muted hover:text-accent ${workspace.id === workspaceId || paths === '/' ? 'text-accent/80' : ''}`}
                              >
                                <div
                                  className={`mb-2 flex items-center gap-2 font-semibold`}
                                >
                                  {workspace.id === workspaceId ||
                                    paths === '/' ? (
                                    <PackageOpen className="h-4 w-4" />
                                  ) : (
                                    <Package className="h-4 w-4" />
                                  )}
                                  {workspace?.id === user?.workspaceId
                                    ? 'Home'
                                    : workspace?.shortName}
                                </div>
                              </Link>
                              <div className="text-sm">
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspace?.id
                                  )
                                  .map(({ userId, createdAt, id }) => (
                                    <div
                                      className="mb-2 h-full"
                                      key={`${workspace?.id}-${id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${id}`}
                                        className={`flex h-full flex-col rounded-lg border border-muted/40 bg-background/40 p-2 text-white transition-colors duration-300 hover:border-accent hover:shadow-lg`}
                                      >
                                        <div className="text-sm font-semibold">
                                          <div className="flex items-center justify-between">
                                            <div
                                              className={`mb-1 flex items-center gap-2 text-muted ${id === background?.sessionId ? 'text-accent' : ''}`}
                                            >
                                              Created {formatDistanceToNow(createdAt)} ago by{' '}
                                              {
                                                users?.find((user) => user.id === userId)
                                                  ?.firstName
                                              }{' '}
                                              {users?.find((user) => user.id === userId)?.lastName}
                                            </div>
                                          </div>
                                          <div className="text-xs">
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
                                                    id === instance.sessionId
                                                )
                                                .map(
                                                  (instance) =>
                                                    apps?.find(
                                                      (app) =>
                                                        app.id ===
                                                        instance.appId
                                                    )?.name || ''
                                                )
                                                .join(', ')}
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
                                className={`text-muted hover:text-accent ${workspace.id === workspaceId || paths === '/' ? 'text-accent/80' : ''}`}
                              >
                                <div
                                  className={`mb-2 flex items-center gap-2 font-semibold`}
                                >
                                  {workspace.id === workspaceId ||
                                    paths === '/' ? (
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
                                  .map(({ userId, createdAt, id }) => (
                                    <div
                                      className="mb-2 h-full"
                                      key={`${workspace?.id}-${id}`}
                                    >
                                      <Link
                                        href={`/workspaces/${workspace?.id}/sessions/${id}`}
                                        className={`flex h-full flex-col rounded-lg border border-muted/40 bg-background/40 p-2 text-white transition-colors duration-300 hover:border-accent hover:shadow-lg`}
                                      >
                                        <div className="text-sm font-semibold">
                                        <div className="flex items-center justify-between">
                                            <div
                                              className={`mb-1 flex items-center gap-2 text-muted ${id === background?.sessionId ? 'text-accent' : ''}`}
                                            >
                                              Created {formatDistanceToNow(createdAt)} ago by{' '}
                                              {
                                                users?.find((user) => user.id === userId)
                                                  ?.firstName
                                              }{' '}
                                              {users?.find((user) => user.id === userId)?.lastName}
                                            </div>
                                          </div>
                                          <div className="text-xs">
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
                                                    id === instance.sessionId
                                                )
                                                .map(
                                                  (instance) =>
                                                    apps?.find(
                                                      (app) =>
                                                        app.id ===
                                                        instance.appId
                                                    )?.name || ''
                                                )
                                                .join(', ')}
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
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="overflow-hidden text-muted hover:bg-inherit hover:text-accent md:hidden"
                  variant="ghost"
                  onClick={toggleRightSidebar}
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="text-white md:hidden">
                <div className="grid gap-4 p-4">
                  <NavLink
                    href="/"
                    exact={!isUserWorkspace}
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex items-center gap-2">
                      <House className="h-4 w-4" />
                      Home
                    </div>
                  </NavLink>
                  <NavLink
                    href="/workspaces"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    exact={isUserWorkspace}
                  >
                    <div className="mt-1 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Workspaces
                    </div>
                  </NavLink>

                  <NavLink
                    href="/app-store"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      App Store
                    </div>
                  </NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        <div className="flex items-center justify-end">
          {isAuthenticated && (
            <div className="relative mr-2 hidden flex-1 xl:block">
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted" />
              <Input
                disabled
                type="search"
                placeholder="Find workspaces, apps, content ..."
                className="h-7 w-full border border-muted/40 bg-background pl-8 md:w-[240px] lg:w-[240px]"
              />
            </div>
          )}

          <div className="ml-1 flex items-center gap-2">
            <div className="flex items-center justify-end">
              {isAuthenticated && (
                <Button
                  size="icon"
                  className="overflow-hidden text-muted hover:bg-inherit hover:text-accent"
                  variant="ghost"
                  onClick={toggleRightSidebar}
                >
                  <CircleHelp />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="overflow-hidden text-muted hover:bg-inherit hover:text-accent"
                    variant="ghost"
                  >
                    {user?.avatar && (
                      <Image
                        src={user?.avatar || userPlaceholder}
                        width={24}
                        height={24}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                        style={{ aspectRatio: '24/24', objectFit: 'cover' }}
                      />
                    )}
                    {!user?.avatar && <User />}
                  </Button>
                </DropdownMenuTrigger>
                {isAuthenticated ? (
                  <DropdownMenuContent
                    align="end"
                    className="bg-black text-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/users/me">
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="#" passHref>
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogoutClick}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent
                    align="end"
                    className="bg-black text-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    {internalLogin && (
                      <DropdownMenuItem asChild>
                        <Link href="/register" passHref>
                          Register
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </div>

        <WorkbenchDeleteForm
          id={params.sessionId}
          state={[deleteOpen, setDeleteOpen]}
          onUpdate={() => {
            setNotification({
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
            onUpdate={() => {}}
          />
        )}
      </nav>

      <AlertDialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <AlertDialogContent className="bg-black bg-opacity-85 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>About {currentWorkbench?.name}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {currentWorkbench?.name?.slice(0, 2)}
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{currentWorkbench?.shortName}</p>
                  <p className="text-sm text-muted">
                    Created{' '}
                    {formatDistance(
                      currentWorkbench?.createdAt ?? 0,
                      new Date()
                    )}{' '}
                    ago
                  </p>
                </div>
              </div>
              {currentWorkbench?.description && (
                <p className="text-sm">{currentWorkbench.description}</p>
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
