'use client'
import { formatDistance } from 'date-fns'
import {
  AppWindow,
  Folder,
  FolderOpen,
  LaptopMinimal,
  Search
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useState, useTransition } from 'react'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu'
import { Workbench } from '~/domain/model'
import { useToast } from '~/hooks/use-toast'

import {
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import { HeaderButtons } from './header-buttons'
import NavLink from './nav-link'
import { ALBERT_WORKSPACE_ID } from './store/app-state-context'
import { useAuth } from './store/auth-context'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

interface BreadcrumbItem {
  name: string
  href?: string
}

interface ItemProps {
  name: string
  href?: string
}

export function Header() {
  const paths = usePathname()
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    error,
    setError,
    background,
    setBackground,
    refreshWorkspaces,
    refreshWorkbenches
  } = useAppState()
  const { user, refreshUser } = useAuth()

  const [deleted, setDeleted] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams<{ workspaceId: string; desktopId: string }>()
  const [isPending, startTransition] = useTransition()
  const { isAuthenticated } = useAuth()
  const isInAppContext = params?.workspaceId && params?.desktopId
  const workspaceId = params?.workspaceId
  const [currentWorkbench, setCurrentWorkbench] = useState<Workbench>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const isAlbertWorkspace = params?.workspaceId === ALBERT_WORKSPACE_ID
  const [showAboutDialog, setShowAboutDialog] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    startTransition(async () => {
      try {
        await Promise.all([
          refreshWorkspaces(),
          refreshWorkbenches(),
          refreshUser()
        ])
      } catch (error) {
        setError(error.message)
      }
    })
  }, [background?.workbenchId, isAuthenticated])

  const pathNames = useMemo(
    () => paths?.split('/').filter(Boolean) || [],
    [paths]
  )

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
      // Special handling for ALBERT_WORKSPACE_ID
      // if (params.workspaceId === ALBERT_WORKSPACE_ID) {
      // For desktop view: Home > Desktops > [desktop-name]
      // if (params.desktopId) {
      //   const workbench = workbenches?.find((w) => w.id === params.desktopId)
      //   updatedItems = [
      //     { name: 'Home', href: '/' },
      //     { name: 'Desktops', href: `workspaces/${ALBERT_WORKSPACE_ID}` }
      //   ]
      //   if (workbench?.shortName) {
      //     updatedItems.push({
      //       name: workbench.shortName,
      //       href: `workspaces/${ALBERT_WORKSPACE_ID}/desktops/${params.desktopId}`
      //     })
      //   }
      // } else {
      //   // For workspace view: Just show Home
      //   updatedItems = [{ nam  e: 'Home', href: '/' }]
      // }
      // } else {
      // Regular workspace handling
      const workspace = workspaces?.find((w) => w.id === params.workspaceId)
      if (workspace?.shortName) {
        updatedItems[1] = {
          ...updatedItems[1],
          name:
            params.workspaceId === ALBERT_WORKSPACE_ID
              ? 'Home'
              : workspace.shortName
        }
        // }

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
    workspaces
  ])

  useEffect(() => {
    setItems(initialItems)
    updateBreadcrumbItems()
  }, [updateBreadcrumbItems, initialItems])

  useEffect(() => {
    if (isInAppContext && workbenches) {
      const workbench = workbenches.find((w) => w.id === params.desktopId)
      if (workbench) {
        setCurrentWorkbench(workbench)
      }
    }
  }, [isInAppContext, workbenches, params.desktopId])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error!',
        description: error,
        variant: 'destructive',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [error])

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Desktop was deleted, redirecting to workspace...',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [deleted])

  // Extract Item component
  const BreadcrumbItemComponent = ({ name, href }: ItemProps) => (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="border-b-2 border-transparent text-sm text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
          >
            {name}
          </Link>
        ) : (
          <span>{name}</span>
        )}
      </BreadcrumbLink>
    </BreadcrumbItem>
  )

  const workspacesWithWorkbenches = workspaces?.filter((workspace) =>
    workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
  )

  const sortedWorkspacesWithWorkbenches = workspacesWithWorkbenches?.sort(
    (a, b) => (a.id === workspaceId ? 1 : 0)
  )

  return (
    <>
      <nav className="relative flex h-11 min-w-full flex-wrap items-center justify-between gap-2 bg-black bg-opacity-85 px-4 py-1 text-slate-100 shadow-lg backdrop-blur-sm md:flex-nowrap">
        <div className="flex min-w-0 flex-shrink flex-nowrap items-center justify-start">
          <Link href="/" passHref className="">
            <Image
              src={logo}
              alt="Chorus"
              height={32}
              className="mt-1 aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          </Link>
          <div className="min-w-0 flex-1 pr-4">
            <Breadcrumb className="mt-1 pl-2">
              <BreadcrumbList className="text-primary-foreground">
                {paths && paths.length > 1 && <BreadcrumbSeparator />}
                {items.map((item, index) => (
                  <Fragment key={item.href}>
                    {/* Home and Workspaces Menu */}
                    {index === 1 && (
                      <BreadcrumbItemComponent
                        href={item.href ? `/${item.href}` : undefined}
                        name={item.name}
                      />
                    )}

                    {/* Workspaces Menu */}
                    {index === 0 && (
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className="xtext-sm border-b-2 font-normal hover:border-b-2 hover:border-accent">
                            <Link href={`/workspaces/`} legacyBehavior passHref>
                              <span className="flex items-center gap-2">
                                <Folder className="h-3.5 w-3.5" />
                                <span>My workspaces</span>
                              </span>
                            </Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                              <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                {workspaces?.map((workspace) => (
                                  <NavigationMenuItem
                                    key={workspace.id}
                                    className="group/workspace relative"
                                  >
                                    <ListItem
                                      className="p-1 font-semibold"
                                      href={`/workspaces/${workspace.id}`}
                                    >
                                      <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                        <div className="flex items-center gap-2">
                                          {workspace.id === workspaceId ? (
                                            <FolderOpen className="h-3.5 w-3.5 text-accent" />
                                          ) : (
                                            <Folder className="h-3.5 w-3.5" />
                                          )}
                                          {workspace?.id === ALBERT_WORKSPACE_ID ? 'Home' : workspace?.shortName}
                                        </div>
                                        <span className="text-sm leading-snug text-muted-foreground">
                                          {(() => {
                                            const w = workbenches?.filter((workbench) => workbench.workspaceId === workspace.id)?.length || 0
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

                    {/* Desktops Menu */}
                    {index === 2 && (
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className="xtext-sm border-b-2 font-normal hover:border-b-2 hover:border-accent">
                              <Link href={`/workspaces/${workspaceId}/desktops/`} legacyBehavior passHref>
                                <span className="flex items-center gap-2">
                                  <LaptopMinimal className="h-3.5 w-3.5" />
                                  <span>Desktops</span>
                                </span>
                              </Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                              <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                {/* Desktop Info Section */}
                                {workbenches
                                  ?.filter(
                                    (workbench) =>
                                      workbench.workspaceId === workspaceId
                                  )
                                  .map((workbench) => (
                                    <NavigationMenuItem
                                      key={workbench.id}
                                      className="group/desktop relative"
                                    >
                                      <ListItem
                                        className="p-1 font-semibold"
                                        href={`/workspaces/${workbench.workspaceId}/desktops/${workbench.id}`}
                                      >
                                        <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                          <div className="flex items-center gap-2">
                                            {workbench.id === background?.workbenchId ? (
                                              <LaptopMinimal className="h-3.5 w-3.5 text-accent" />
                                            ) : (
                                              <LaptopMinimal className="h-3.5 w-3.5" />
                                            )}
                                            {workbench.name}
                                          </div>
                                          <span className="text-sm leading-snug text-muted-foreground font-semibold">
                                            {(() => {
                                              const filteredApps = appInstances
                                                ?.filter(instance => instance.workbenchId === workbench.id)
                                                ?.map(instance => apps?.find(app => app.id === instance.appId)?.name)
                                                ?.filter(Boolean) || []

                                              return `${filteredApps.length} ${filteredApps.length === 1 ? 'app' : 'apps'}: ${filteredApps.join(', ')}`
                                            })()}
                                          </span>
                                        </div>
                                      </ListItem>
                                      {/* </NavigationMenuLink> */}
                                    </NavigationMenuItem>
                                  ))}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    )}

                    {/* Desktop Menu */}
                    {index === 3 && (
                      <NavigationMenu>
                        <NavigationMenuList>
                          {isInAppContext && currentWorkbench && (
                            <NavigationMenuItem>
                              <NavigationMenuTrigger className="xtext-sm border-b-2 border-accent font-normal text-white hover:border-b-2 hover:border-accent">
                                <span className="flex items-center gap-2">
                                  <LaptopMinimal className="h-3.5 w-3.5" />
                                  <span>{currentWorkbench.name}</span>
                                </span>
                              </NavigationMenuTrigger>
                              <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                                <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                                  {/* Desktop Info Section */}
                                  <ListItem
                                    title={`About ${currentWorkbench?.name}`}
                                    className="p-1 font-semibold"
                                    onClick={() => setShowAboutDialog(true)}
                                  ></ListItem>
                                  <span className="pl-1 text-sm leading-snug text-muted-foreground font-semibold">
                                    {(() => {
                                      const filteredApps = appInstances
                                        ?.filter(instance => instance.workbenchId === currentWorkbench.id)
                                        ?.map(instance => apps?.find(app => app.id === instance.appId)?.name)
                                        ?.filter(Boolean) || []

                                      return `${filteredApps.length} ${filteredApps.length === 1 ? 'app' : 'apps'}: ${filteredApps.join(', ')}`
                                    })()}
                                  </span>
                                  <Separator className="m-1 my-2" />
                                  {/* Settings Section */}
                                  <ListItem
                                    title="Settings..."
                                    className="cursor-pointer p-1 hover:bg-accent"
                                    onClick={() => setUpdateOpen(true)}
                                  ></ListItem>

                                  {/* Start New App Section */}
                                  <ListItem
                                    title="Start New App..."
                                    className="cursor-pointer p-1 hover:bg-accent"
                                    onClick={() => setCreateOpen(true)}
                                  ></ListItem>
                                  <Separator className="m-1 my-2" />
                                  {/* Fullscreen Section */}
                                  <ListItem
                                    title="Toggle Fullscreen"
                                    className="cursor-pointer p-1 hover:bg-accent"
                                    onClick={() => {
                                      const iframe =
                                        document.getElementById('iframe')
                                      if (iframe) {
                                        iframe.requestFullscreen()
                                      }
                                    }}
                                  ></ListItem>

                                  <Separator className="m-1 my-2" />

                                  {/* Quit Section */}
                                  <ListItem
                                    title="Quit ..."
                                    className="cursor-pointer p-1"
                                    onClick={() => setDeleteOpen(true)}
                                  ></ListItem>
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          )}
                        </NavigationMenuList>
                      </NavigationMenu>
                    )}

                    {index === 1 && <BreadcrumbSeparator className="text-muted" />}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
          <NavigationMenuList className="flex items-center justify-center gap-3">
            <NavigationMenuItem>
              <NavLink
                href="/"
                exact={!isAlbertWorkspace}
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
              >
                Home
              </NavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavLink
                href="/workspaces"
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                exact={isAlbertWorkspace}
              >
                <div className="mt-1 flex items-center gap-2">
                  <Folder className="h-3.5 w-3.5" />
                  Workspaces
                </div>
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink
                href="/app-store"
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
              >
                App Store
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="mt-1 flex items-center gap-2">
                  <AppWindow className="h-3.5 w-3.5" />
                  <span>My Apps</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                <ul className="grid gap-3 bg-black bg-opacity-85 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                  {apps?.map((app) => (
                    <ListItem key={app.name} title={''}>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {app.name === 'vscode' && (
                            <AvatarImage
                              src="/vscode.png"
                              className="m-auto h-8 w-8"
                            />
                          )}
                          <AvatarFallback>
                            {app?.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <AppWindow className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium leading-none">
                              {app.name}
                            </span>
                          </div>

                          <span className="text-sm text-muted-foreground">
                            {app.dockerImageName}:{app.dockerImageTag}
                          </span>

                          {/* <div className="ml-auto flex flex-col items-center gap-2">
                            {appInstances
                              ?.filter((instance) => instance.appId === app.id)
                              ?.filter((instance) => workspaces?.some((w) => w.id === instance.workspaceId))
                              ?.filter((instance) => workbenches?.some((w) => w.id === instance.workbenchId))
                              .map((instance) => {
                                const workbench = workbenches?.find(
                                  (w) => w.id === instance.workbenchId
                                )
                                const workspace = workspaces?.find(
                                  (w) => w.id === instance.workspaceId
                                )
                                return (
                                  <Link
                                    key={instance.id}
                                    href={`/workspaces/${instance.workspaceId}/desktops/${instance.workbenchId}`}
                                    className="flex items-center gap-1 rounded bg-accent px-2 py-1 text-xs hover:bg-accent/80"
                                  >
                                    <Play className="h-3 w-3" />
                                    <span>{workspace?.shortName || ''}</span>
                                    <span className="text-muted-foreground">/</span>
                                    <span>{workbench?.name || ''}</span>
                                  </Link>
                                )
                              })}
                          </div> */}
                        </div>
                      </div>
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="mt-1 flex items-center gap-1">
                  <MonitorPlay className="h-3.5 w-3.5" />
                  <span>Desktops</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                <ul className="grid gap-3 bg-black bg-opacity-85 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                  {sortedWorkspacesWithWorkbenches?.map((workspace) => (
                    <div className="" key={workspace.id}>
                      {workspace.id === ALBERT_WORKSPACE_ID
                        ? 'Home'
                        : workspace.shortName}
                      {workbenches
                        ?.filter(
                          (workbench) => workbench.workspaceId === workspace.id
                        )
                        .map((workbench) => (
                          <ListItem
                            className={`{background?.workbenchId === workbench.id ? 'hover:bg-primary' : 'hover:bg-accent'} ${background?.workbenchId === workbench.id ? 'bg-primary' : ''}`}
                            key={workbench.name}
                            title={''}
                            href={`/workspaces/${workbench.workspaceId}/desktops/${workbench.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {workbench.name === 'vscode' && (
                                  <AvatarImage
                                    src="/vscode.png"
                                    className="m-auto h-8 w-8"
                                  />
                                )}
                                <AvatarFallback>
                                  {workbench.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <MonitorPlay className="h-3.5 w-3.5" />
                                  <span className="text-sm font-medium leading-none">
                                    {workbench.name}
                                  </span>
                                </div>

                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(workbench.createdAt)} ago
                                </span>

                                <div className="pl-4">
                                  {appInstances
                                    ?.filter(
                                      (appInstance) =>
                                        appInstance.workbenchId === workbench.id
                                    )
                                    ?.map((appInstance) => (
                                      <div
                                        key={appInstance.id}
                                        className="flex items-center gap-2"
                                      >
                                        <AppWindow className="h-3.5 w-3.5" />
                                        <span className="text-sm font-medium leading-none">
                                          {
                                            apps?.find(
                                              (app) =>
                                                app.id === appInstance.appId
                                            )?.name
                                          }
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </ListItem>
                        ))}
                    </div>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
            {/* <NavigationMenuItem>
              <NavLink
                href="/admin"
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
              >
                Admin
              </NavLink>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
            <Input
              disabled
              type="search"
              placeholder="Find workspaces, apps, content ..."
              className="h-7 w-full border-none bg-background pl-8 md:w-[240px] lg:w-[360px]"
            />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <HeaderButtons />
          </div>
        </div>

        <WorkbenchDeleteForm
          id={params.desktopId}
          state={[deleteOpen, setDeleteOpen]}
          onUpdate={() => {
            setDeleted(true)
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
      {/* {isInAppContext && currentWorkbench && (
        <nav
          className={`transition-transform duration-300 ease-in-out ${showSecondNav ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <Menubar className="h-8 rounded-none bg-white">
            <MenubarMenu>
              <MenubarTrigger>{currentWorkbench?.name}</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setShowAboutDialog(true)}>
                  About {currentWorkbench?.name}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => setUpdateOpen(true)}>
                  Settings...
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => setDeleteOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Quit
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setCreateOpen(true)}>
                  <Play className="mr-2 h-4 w-4" />
                  Start New App <MenubarShortcut>⌘A</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger disabled>Share</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Email link</MenubarItem>
                    <MenubarItem>Messages</MenubarItem>
                    <MenubarItem>Notes</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={() => {
                    const iframe = document.getElementById('iframe')
                    if (iframe) {
                      iframe.requestFullscreen()
                    }
                  }}
                >
                  <Maximize className="mr-2 h-4 w-4" />
                  <span>Toggle Fullscreen</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </nav>
      )} */}

      <AlertDialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <AlertDialogContent className="bg-black bg-opacity-85 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>About {currentWorkbench?.name}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {currentWorkbench?.name === 'vscode' && (
                    <AvatarImage src="/vscode.png" className="m-auto" />
                  )}
                  <AvatarFallback className="text-lg">
                    {currentWorkbench?.name?.slice(0, 2)}
                  </AvatarFallback>
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
