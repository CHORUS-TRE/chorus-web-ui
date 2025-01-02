'use client'
import React, { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Maximize, Search } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@/components/ui/menubar'

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

import { WorksbenchDeleteForm } from './forms/workbench-forms'
import { useAppState } from './store/app-state-context'
import { useAuth } from './store/auth-context'
import Breadcrumb from './breadcrumb'
import { HeaderButtons } from './header-buttons'
import NavLink from './nav-link'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

interface HeaderProps {
  additionalHeaderButtons?: React.ReactNode
}

export function Header({ additionalHeaderButtons }: HeaderProps) {
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
  const params = useParams<{ workspaceId: string; appId: string }>()
  const [isPending, startTransition] = useTransition()
  const { isAuthenticated } = useAuth()
  const isInAppContext = params?.workspaceId && params?.appId
  const workspaceId = params?.workspaceId
  const [currentWorkbench, setCurrentWorkbench] = useState<Workbench>()

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

  useEffect(() => {
    if (isInAppContext && workbenches) {
      const workbench = workbenches.find((w) => w.id === params.appId)
      if (workbench) {
        setCurrentWorkbench(workbench)
      }
    }
  }, [isInAppContext, workbenches, params.appId])

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

  const workspacesWithWorkbenches = workspaces?.filter((workspace) =>
    workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
  )

  const sortedWorkspacesWithWorkbenches = workspacesWithWorkbenches?.sort(
    (a, b) => (a.id === workspaceId ? 1 : 0)
  )

  return (
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
        <div className="min-w-0 flex-1">
          <Breadcrumb />
        </div>
        {isInAppContext && currentWorkbench && (
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="font-medium text-muted hover:text-accent data-[state=open]:text-accent">
                {currentWorkbench.name}
              </MenubarTrigger>
              <MenubarContent align="start" className="min-w-[180px]">
                <MenubarItem asChild>
                  <AppInstanceCreateForm
                    workbenchId={params.appId}
                    userId={user?.id}
                    workspaceId={params.workspaceId}
                  />
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <WorksbenchDeleteForm
                    id={params.appId}
                    onUpdate={() => {
                      setDeleted(true)
                      setTimeout(() => {
                        setBackground(undefined)
                        router.replace(`/workspaces/${workspaceId}`)
                      }, 2000)
                    }}
                  />
                </MenubarItem>
                <MenubarItem
                  onClick={() => {
                    const iframe = document.getElementById('iframe')
                    if (iframe) {
                      iframe.requestFullscreen()
                    }
                  }}
                >
                  <Maximize className="mr-2 h-4 w-4" />
                  <span>Fullscreen</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>

      <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
        <NavigationMenuList className="flex items-center justify-center gap-4">
          <NavigationMenuItem>
            <NavLink
              href="/"
              exact
              className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
            >
              My Workspace
            </NavLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavLink
              href="/workspaces"
              className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
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
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
                    {workspace.shortName}
                    {workbenches
                      ?.filter(
                        (workbench) => workbench.workspaceId === workspace.id
                      )
                      .map((workbench) => (
                        <ListItem
                          className={`{background?.workbenchId === workbench.id ? 'hover:bg-primary' : 'hover:bg-accent'} ${background?.workbenchId === workbench.id ? 'bg-primary' : ''}`}
                          key={workbench.name}
                          title={''}
                          href={`/workspaces/${workbench.workspaceId}/${workbench.id}`}
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
    </nav>
  )
}
