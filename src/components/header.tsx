'use client'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { formatDistance, formatDistanceToNow } from 'date-fns'
import {
  CircleHelp,
  DraftingCompass,
  House,
  LaptopMinimal,
  Menu,
  Package,
  PackageOpen,
  Search,
  Store,
  User
} from 'lucide-react'

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
import { getAppIcon } from '~/utils/app-icon'

import { appInstanceCreate } from './actions/app-instance-view-model'
import {
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import { useAuth } from './store/auth-context'
import { Input } from './ui/input'
import NavLink from './nav-link'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import userPlaceholder from '/public/placeholder-user.jpg'

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
    refreshWorkspaces,
    refreshWorkbenches,
    toggleRightSidebar
  } = useAppState()
  const { user, isAuthenticated, setAuthenticated } = useAuth()

  const params = useParams<{ workspaceId: string; desktopId: string }>()
  const workspaceId = params?.workspaceId
  const [currentWorkbench, setCurrentWorkbench] = useState<Workbench>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [authModes, setAuthModes] = useState<AuthenticationMode[]>([])

  const isInAppContext = params?.workspaceId && params?.desktopId
  const isUserWorkspace = params?.workspaceId === user?.workspaceId

  const pathNames = useMemo(
    () => paths?.split('/').filter(Boolean) || [],
    [paths]
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
    [pathNames, capitalize, workspaces, currentWorkbench]
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

        if (params?.desktopId) {
          const workbench = workbenches?.find((w) => w.id === params.desktopId)
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
    params?.desktopId,
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
      const workbench = workbenches.find((w) => w.id === params.desktopId)
      console.log('workbench', workbench)
      if (workbench) {
        setCurrentWorkbench(workbench)
      }
    }
  }, [isInAppContext, workbenches, params.desktopId])

  useEffect(() => {
    const fetchAuthModes = async () => {
      try {
        const response = await getAuthenticationModes()
        setAuthModes(response.data || [])
      } catch (error) {
        setNotification({
          title: 'Error fetching auth modes:',
          description: error.message,
          variant: 'destructive'
        })
        console.error('Error fetching auth modes:', error)
      }
    }

    fetchAuthModes()
  }, [])

  return (
    <>
      <nav className="relative flex h-11 min-w-full flex-wrap items-center justify-between gap-2 bg-black bg-opacity-85 px-4 py-1 text-slate-100 shadow-lg backdrop-blur-sm md:flex-nowrap">
        <div className="flex min-w-0 flex-shrink flex-nowrap items-center justify-start">
          <Link href="/" passHref className="">
            <Image
              src={logo}
              alt="Chorus"
              height={32}
              className="aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          </Link>
          {isAuthenticated && (
            <div className="min-w-0 flex-1 pr-4">
              <Breadcrumb className="pl-2">
                <BreadcrumbList className="text-primary-foreground">
                  {paths && paths.length > 1 && (
                    <BreadcrumbSeparator className="text-muted" />
                  )}
                  {items.map((item, index) => (
                    <Fragment key={item.href}>
                      {/* Workspaces Menu */}
                      {index === 0 && (
                        <NavigationMenu className="hidden xl:block">
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavLink
                                href={`/workspaces/`}
                                exact
                                className={`mt-1 inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent pl-1 text-sm font-light text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white ${paths === '/workspaces' ? 'border-accent' : ''}`}
                              >
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  <span>My workspaces</span>
                                </div>
                              </NavLink>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}

                      {/* Workspace Menu  Dropdown */}
                      {index === 0 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                className={`mb-1 border-b-2 text-sm font-light hover:border-b-2 hover:border-accent`}
                              >
                                <NavLink
                                  href={`#`}
                                  className={`inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent px-[0.5px] py-1 text-sm font-light text-muted transition-colors hover:border-b-2 data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white`}
                                >
                                  {''}
                                </NavLink>
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
                                        href={`/workspaces/${workspace.id}`}
                                        wrapWithLi={false}
                                      >
                                        <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                          <div
                                            className={`flex items-center gap-2 ${workspace.id === workspaceId ? 'text-accent text-white' : ''}`}
                                          >
                                            {workspace.id === workspaceId || paths === '/' ? (
                                              <PackageOpen className="h-4 w-4" />
                                            ) : (
                                              <Package className="h-4 w-4" />
                                            )}
                                            {workspace?.id === user?.workspaceId
                                              ? 'Home'
                                              : workspace?.shortName}
                                          </div>
                                          <span className="text-sm font-semibold leading-snug text-muted-foreground">
                                            {(() => {
                                              const w =
                                                workbenches?.filter(
                                                  (workbench) =>
                                                    workbench.workspaceId ===
                                                    workspace.id
                                                )?.length || 0
                                              return `${w} open ${w <= 1 ? 'desktop' : 'desktops'}`
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

                      {/* Workspace's desktops Menu */}
                      {index === 1 && (
                        <NavigationMenu className="hidden xl:block">
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavLink
                                href={`/workspaces/${workspaceId}`}
                                exact
                                className={`mt-1 inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent pl-1 text-sm font-light text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white ${paths === '/workspaces/${workspaceId}' ? 'border-accent' : ''}`}
                              >
                                <div className="flex items-center gap-2">
                                  <PackageOpen className="h-4 w-4" />
                                  <span>{item.name}</span>
                                </div>
                              </NavLink>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}

                      {/* Workspace's desktops Menu  Dropdown*/}
                      {index === 1 && (
                        <NavigationMenu className="hidden xl:block">
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                className={`mb-1 border-b-2 text-sm font-light hover:border-b-2 hover:border-accent`}
                              >
                                <NavLink
                                  href={`#`}
                                  className={`inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent px-[0.5px] py-1 text-sm font-light text-muted transition-colors hover:border-b-2 data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white`}
                                >
                                  {''}
                                </NavLink>
                              </NavigationMenuTrigger>
                              {workbenches &&
                                workbenches.filter(
                                  (workbench) =>
                                    workbench.workspaceId === workspaceId
                                ).length > 0 && (
                                  <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                    <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                      {/* Desktop Info Section */}
                                      {workbenches
                                        ?.filter(
                                          (workbench) =>
                                            workbench.workspaceId ===
                                            workspaceId
                                        )
                                        .map((workbench) => (
                                          <NavigationMenuItem
                                            key={workbench.id}
                                            className="group/desktop relative"
                                          >
                                            <ListItem
                                              className="p-1 font-semibold"
                                              href={`/workspaces/${workbench.workspaceId}/desktops/${workbench.id}`}
                                              wrapWithLi={false}
                                            >
                                              <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                                <div
                                                  className={`mb-[2px] flex items-center gap-2 ${workbench.id === background?.workbenchId ? 'text-accent' : ''}`}
                                                >
                                                  <LaptopMinimal className="h-4 w-4" />
                                                  {workbench.name}
                                                </div>
                                                <span className="text-sm font-semibold leading-snug text-muted-foreground">
                                                  {(() => {
                                                    const filteredApps =
                                                      appInstances
                                                        ?.filter(
                                                          (instance) =>
                                                            instance.workbenchId ===
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
                                                        ?.filter(Boolean) || []

                                                    return (
                                                      <div className="flex items-center gap-2 text-xs">
                                                        <DraftingCompass className="h-4 w-4 shrink-0" />
                                                        {filteredApps.join(
                                                          ', '
                                                        )}
                                                      </div>
                                                    )
                                                  })()}
                                                </span>
                                              </div>
                                            </ListItem>
                                            {/* </NavigationMenuLink> */}
                                          </NavigationMenuItem>
                                        ))}
                                    </ul>
                                  </NavigationMenuContent>
                                )}
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      )}

                      {/* Desktop Menu */}
                      {index === 2 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            {isInAppContext && currentWorkbench && (
                              <NavigationMenuItem>
                                <NavigationMenuTrigger className="ml-1 border-b-2 border-accent text-sm font-light text-white hover:border-b-2 hover:border-accent">
                                  <span className="flex items-center gap-2">
                                    <LaptopMinimal className="h-4 w-4" />
                                    <span>{currentWorkbench.name}</span>
                                  </span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                  <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                    {/* Desktop Info Section */}
                                    <NavigationMenuItem>
                                      <ListItem
                                        title={`About ${currentWorkbench?.name}`}
                                        className="p-1 font-semibold"
                                        onClick={() => setShowAboutDialog(true)}
                                        wrapWithLi={false}
                                      >
                                        <div className="pl-1 text-sm font-semibold text-muted-foreground">
                                          {(() => {
                                            const filteredApps =
                                              appInstances
                                                ?.filter(
                                                  (instance) =>
                                                    instance.workbenchId ===
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
                                                <DraftingCompass className="h-4 w-4 shrink-0" />
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
                                      onClick={() => setCreateOpen(true)}
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
                                      title="Quit ..."
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
              <NavigationMenuList className="flex items-center justify-center gap-4">
                <NavigationMenuItem id="getting-started-step-home">
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
                </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step3">
                  <NavLink
                    href="/workspaces"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    exact={isUserWorkspace}
                  >
                    <div className="mt-1 flex place-items-center gap-2">
                      <Package className="h-4 w-4" />
                      Workspaces
                    </div>
                  </NavLink>
                </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="mt-1 flex items-center gap-2">
                        <LaptopMinimal className="h-4 w-4" />
                        <span>Open Desktops</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                        <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                          {sortedWorkspacesWithWorkbenches?.map((workspace) => (
                            <div className="mb-2 p-2" key={`dock-${workspace.id}`}>
                              <div
                                className={`flex items-center gap-2 font-semibold text-muted-foreground`}
                              >
                                {workspace.id === workspaceId || paths === '/' ? (
                                  <PackageOpen className="h-4 w-4" />
                                ) : (
                                  <Package className="h-4 w-4" />
                                )}
                                {workspace?.id === user?.workspaceId
                                  ? 'Home'
                                  : workspace?.shortName}
                              </div>
                              <div className="text-sm">
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspace?.id
                                  )
                                  .map(({ shortName, createdAt, id }) => (
                                    <div className="h-full" key={workspace?.id}>
                                      <Link
                                        href={`/workspaces/${workspace?.id}/desktops/${id}`}
                                        className={`p-2 flex flex-col rounded-2xl border-muted/40 bg-background/40 text-white transition-colors duration-300 hover:bg-background/80 hover:shadow-lg hover:border-accent h-full`}
                                      >
                                        <div className="text-sm font-semibold">
                                          <div className="flex items-center justify-between">
                                            <div
                                              className={`mb-1 flex items-center gap-2 ${id === background?.workbenchId ? 'text-accent' : ''}`}
                                            >
                                              <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                                              {shortName}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              {formatDistanceToNow(createdAt)} ago
                                            </p>
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2 text-xs">
                                              <DraftingCompass className="h-4 w-4 shrink-0" />
                                              {appInstances
                                                ?.filter(
                                                  (instance) =>
                                                    workspace?.id ===
                                                    instance.workspaceId
                                                )
                                                ?.filter(
                                                  (instance) =>
                                                    id === instance.workbenchId
                                                )
                                                .map(
                                                  (instance) =>
                                                    apps?.find(
                                                      (app) => app.id === instance.appId
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
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href="/app-store"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex place-items-center gap-2">
                      <Store className="h-4 w-4" />
                      App Store
                    </div>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <div className="mt-1 flex place-items-center gap-2">
                      <DraftingCompass className="h-4 w-4" />
                      <span>My Apps</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                    <ul className="grid gap-1 bg-black bg-opacity-85 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                      {apps?.map((app) => (
                        <ListItem
                          key={app.name}
                          className="cursor-pointer text-white hover:text-primary"
                          onClick={async () => {
                            if (!currentWorkbench) {
                              setNotification({
                                title: 'Select a desktop first',
                                description:
                                  'You must select a desktop to launch an app',
                                variant: 'default',
                              })
                              return
                            }

                            setNotification({
                              title: 'Launching app...',
                              description: `Starting ${app.name} in desktop ${currentWorkbench?.name}`,
                              variant: 'default'
                            })

                            const formData = new FormData()
                            formData.append('id', app.id)
                            formData.append('tenantId', '1')
                            formData.append('ownerId', user?.id || '')
                            formData.append('workspaceId', params.workspaceId)
                            formData.append('workbenchId', params.desktopId)

                            try {
                              const result = await appInstanceCreate(
                                {},
                                formData
                              )

                              if (result.error) {
                                setNotification({
                                  title: 'Error launching app',
                                  description: result.error,
                                  variant: 'destructive',

                                })
                                return
                              }

                              setNotification({
                                title: 'Success!',
                                description: `${app.name} launched successfully`,
                              })

                              refreshWorkbenches()
                              refreshWorkspaces()
                            } catch (error) {
                              setNotification({
                                title: 'Error launching app',
                                description: error.message,
                                variant: 'destructive',
                              })
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="x-4 flex items-center">
                              {app.name &&
                                getAppIcon(app.name, { id: 'header-my-apps' })}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <DraftingCompass className="h-4 w-4" />
                                <span className="text-sm font-medium leading-none text-white">
                                  {app.name}
                                </span>
                              </div>

                              <span className="text-sm text-muted-foreground">
                                {app.dockerImageName}:{app.dockerImageTag}
                              </span>
                            </div>
                          </div>
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
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
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
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
          id={params.desktopId}
          state={[deleteOpen, setDeleteOpen]}
          onUpdate={() => {
            setNotification({
              title: 'Success!',
              description: 'Desktop was deleted, redirecting to workspace...',
              variant: 'default'
            })
            setTimeout(() => {
              setBackground(undefined)
              router.replace(`/workspaces/${workspaceId}`)
            }, 2000)
          }}
        />

        <AppInstanceCreateForm
          state={[createOpen, setCreateOpen]}
          workbenchId={params.desktopId}
          userId={user?.id}
          workspaceId={params.workspaceId}
        />

        {currentWorkbench && (
          <WorkbenchUpdateForm
            state={[updateOpen, setUpdateOpen]}
            workbench={currentWorkbench}
            onUpdate={() => { }}
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
                  <p className="text-sm text-muted-foreground">
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
