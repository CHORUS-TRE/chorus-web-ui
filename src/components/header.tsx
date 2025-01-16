'use client'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { formatDistance, formatDistanceToNow } from 'date-fns'
import {
  DraftingCompass,
  Folder,
  FolderOpen,
  House,
  LaptopMinimal,
  Search,
  Store
} from 'lucide-react'

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

import { appInstanceCreate } from './actions/app-instance-view-model'
import {
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import { ALBERT_WORKSPACE_ID } from './store/app-state-context'
import { useAuth } from './store/auth-context'
import { Input } from './ui/input'
import { HeaderButtons } from './header-buttons'
import NavLink from './nav-link'

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
      workspacesWithWorkbenches?.sort((a, b) => (a.id === workspaceId ? 1 : 0)),
    [workspacesWithWorkbenches, workspaceId]
  )

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
            params.workspaceId === ALBERT_WORKSPACE_ID
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
          {isAuthenticated && (
            <div className="min-w-0 flex-1 pr-4">
              <Breadcrumb className="mt-1 pl-2">
                <BreadcrumbList className="text-primary-foreground">
                  {paths && paths.length > 1 && (
                    <BreadcrumbSeparator className="text-muted" />
                  )}
                  {items.map((item, index) => (
                    <Fragment key={item.href}>
                      {/* Workspaces Menu */}
                      {index === 0 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                className={`border-b-2 text-sm font-light hover:border-b-2 hover:border-accent ${paths === '/workspaces' ? 'border-accent' : ''}`}
                              >
                                <Link
                                  href={`/workspaces/`}
                                  legacyBehavior
                                  passHref
                                >
                                  <span className="flex items-center gap-2">
                                    <Folder className="h-4 w-4" />
                                    <span>My workspaces</span>
                                  </span>
                                </Link>
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
                                      >
                                        <div className="flex flex-col items-start justify-start font-semibold text-white hover:text-accent-foreground">
                                          <div
                                            className={`flex items-center gap-2 ${workspace.id === workspaceId ? 'text-accent text-white' : ''}`}
                                          >
                                            {workspace.id === workspaceId ? (
                                              <FolderOpen className="h-4 w-4 text-accent" />
                                            ) : (
                                              <Folder className="h-4 w-4" />
                                            )}
                                            {workspace?.id ===
                                            ALBERT_WORKSPACE_ID
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

                      {/* Workspace Desktops Menu */}
                      {index === 1 && (
                        <NavigationMenu>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger
                                className={`border-b-2 border-transparent text-sm font-light text-muted hover:border-b-2 hover:border-accent ${paths === `/workspaces/${workspaceId}` ? 'border-accent text-white' : ''}`}
                              >
                                <Link
                                  href={`/workspaces/${workspaceId}`}
                                  legacyBehavior
                                  passHref
                                >
                                  <span className="flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4" />
                                    <span>{item.name}</span>
                                  </span>
                                </Link>
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
                                <NavigationMenuTrigger className="border-b-2 border-accent text-sm font-light text-white hover:border-b-2 hover:border-accent">
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
                                    ></ListItem>

                                    {/* Start New App Section */}
                                    <ListItem
                                      title="Start New App..."
                                      className="cursor-pointer p-1 font-semibold hover:bg-accent"
                                      onClick={() => setCreateOpen(true)}
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
                                    ></ListItem>

                                    <Separator className="m-1" />

                                    {/* Quit Section */}
                                    <ListItem
                                      title="Quit ..."
                                      className="cursor-pointer p-1 font-semibold"
                                      onClick={() => setDeleteOpen(true)}
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
          <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
            <NavigationMenuList className="flex items-center justify-center gap-3">
              <NavigationMenuItem>
                <NavLink
                  href="/"
                  exact={!isAlbertWorkspace}
                  className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                >
                  <div className="mt-1 flex items-center gap-[6px]">
                    <House className="h-4 w-4" />
                    Home
                  </div>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  href="/workspaces"
                  className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  exact={isAlbertWorkspace}
                >
                  <div className="mt-1 flex items-center gap-[6px]">
                    <Folder className="h-4 w-4" />
                    Workspaces
                  </div>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  href="/app-store"
                  className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                >
                  <div className="mt-1 flex items-center gap-[6px]">
                    <Store className="h-4 w-4" />
                    App Store
                  </div>
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <div className="mt-1 flex items-center gap-[6px]">
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
                            toast({
                              title: 'Select a desktop first',
                              description:
                                'You must select a desktop to launch an app',
                              variant: 'destructive',
                              className: 'bg-background text-white'
                            })
                            return
                          }

                          toast({
                            title: 'Launching app...',
                            description: `Starting ${app.name} in desktop ${currentWorkbench?.name}`,
                            className: 'bg-background text-white'
                          })

                          const formData = new FormData()
                          formData.append('id', app.id)
                          formData.append('tenantId', '1')
                          formData.append('ownerId', user?.id || '')
                          formData.append('workspaceId', params.workspaceId)
                          formData.append('workbenchId', params.desktopId)

                          try {
                            const result = await appInstanceCreate({}, formData)

                            if (result.error) {
                              toast({
                                title: 'Error launching app',
                                description: result.error,
                                variant: 'destructive',
                                className: 'bg-background text-white'
                              })
                              return
                            }

                            toast({
                              title: 'Success!',
                              description: `${app.name} launched successfully`,
                              className: 'bg-background text-white'
                            })

                            refreshWorkbenches()
                            refreshWorkspaces()
                          } catch (error) {
                            toast({
                              title: 'Error launching app',
                              description: error.message,
                              variant: 'destructive',
                              className: 'bg-background text-white'
                            })
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                app.name === 'vscode'
                                  ? '/vscode.png'
                                  : '/placeholder.svg'
                              }
                              className="m-auto h-8 w-8"
                            />
                            <AvatarFallback className="min-h-8 text-2xl">
                              {app.name?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-[6px]">
                              <DraftingCompass className="h-4 w-4" />
                              <span className="text-sm font-medium leading-none">
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
        )}

        <div className="flex items-center justify-end">
          {isAuthenticated && (
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="mr-3 mt-2">
                  <LaptopMinimal className="h-6 w-6" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                  <ul className="grid w-[320px] gap-1 bg-black bg-opacity-85 p-2">
                    {sortedWorkspacesWithWorkbenches?.map((workspace) => (
                      <div className="p-2" key={`dock-${workspace.id}`}>
                        <div
                          className={`flex items-center gap-2 font-semibold text-muted-foreground`}
                        >
                          {workspace.id === workspaceId ? (
                            <FolderOpen className="h-4 w-4" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )}
                          {workspace?.id === ALBERT_WORKSPACE_ID
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
                              <Link
                                key={id}
                                href={`/workspaces/${workspace?.id}/desktops/${id}`}
                                className={`flex flex-col justify-between rounded-lg border-muted/10 bg-background/40 p-1 text-white hover:border-accent hover:bg-accent hover:text-primary hover:shadow-lg`}
                              >
                                <div className="flex-grow text-sm font-semibold">
                                  <div className="flex items-center justify-between">
                                    <div
                                      className={`flex items-center gap-2 ${id === background?.workbenchId ? 'text-accent' : ''}`}
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
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
          )}

          {isAuthenticated && (
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
              <Input
                disabled
                type="search"
                placeholder="Find workspaces, apps, content ..."
                className="h-7 w-full border border-muted/40 bg-background pl-8 md:w-[240px] lg:w-[240px]"
              />
            </div>
          )}
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
