'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { Fragment, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Maximize, Play, Search, Trash } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '@/components/ui/menubar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'

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
import { ALBERT_WORKSPACE_ID } from './store/app-state-context'
import { useAuth } from './store/auth-context'
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
    let updatedItems: BreadcrumbItem[] = [...initialItems]

    if (params?.workspaceId) {
      // Special handling for ALBERT_WORKSPACE_ID
      if (params.workspaceId === ALBERT_WORKSPACE_ID) {
        // For desktop view: Home > Desktops > [desktop-name]
        if (params.desktopId) {
          const workbench = workbenches?.find((w) => w.id === params.desktopId)
          updatedItems = [
            { name: 'Home', href: '/' },
            { name: 'Desktops', href: `workspaces/${ALBERT_WORKSPACE_ID}` }
          ]
          if (workbench?.shortName) {
            updatedItems.push({
              name: workbench.shortName,
              href: `workspaces/${ALBERT_WORKSPACE_ID}/desktops/${params.desktopId}`
            })
          }
        } else {
          // For workspace view: Just show Home
          updatedItems = [{ name: 'Home', href: '/' }]
        }
      } else {
        // Regular workspace handling
        const workspace = workspaces?.find((w) => w.id === params.workspaceId)
        if (workspace?.shortName) {
          updatedItems[1] = {
            ...updatedItems[1],
            name: workspace.shortName
          }
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
        className: 'bg-background text-white'
      })
    }
  }, [error])

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Desktop was deleted, redirecting to workspace...',
        className: 'bg-background text-white'
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
                {/* <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
                {items.map((item, index) => (
                  <Fragment key={item.href}>
                    <BreadcrumbItemComponent
                      href={item.href ? `/${item.href}` : undefined}
                      name={item.name}
                    />
                    {index < items.length - 1 && <BreadcrumbSeparator />}
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
                Workspaces
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
              <NavigationMenuTrigger>My Desktops</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-black bg-opacity-85 text-white">
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                  {/* <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/services"
                    >
                      <Image
                        src="/chuv.png"
                        alt="CHUV"
                        width={126}
                        height={66}
                        className=""
                      />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        CHUV Services
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Data explorer and cohort builder
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li> */}
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
                                <span className="text-sm font-medium leading-none">
                                  {workbench.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(workbench.createdAt)} ago
                                </span>
                              </div>
                            </div>
                          </ListItem>
                        ))}
                    </div>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
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
            onUpdate={() => {}}
          />
        )}
      </nav>
      {isInAppContext && currentWorkbench && (
        <nav>
          <Menubar className="h-8 rounded-none bg-white">
            <MenubarMenu>
              <MenubarTrigger>{currentWorkbench?.name}</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>About {currentWorkbench?.name}</MenubarItem>
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
      )}
    </>
  )
}
