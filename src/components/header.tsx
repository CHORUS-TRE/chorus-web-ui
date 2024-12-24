'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Search } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import customServices from '@/data/data-source/chorus-api/custom-services.json'

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu'
import { Workbench, Workspace } from '~/domain/model'

import { workbenchList } from './actions/workbench-view-model'
import { workspaceList } from './actions/workspace-view-model'
import { useAuth } from './store/auth-context'
import { useNavigation } from './store/navigation-context'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import Breadcrumb from './breadcrumb'
import { HeaderButtons } from './header-buttons'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

interface HeaderProps {
  additionalHeaderButtons?: React.ReactNode
}

export function Header({ additionalHeaderButtons }: HeaderProps) {
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [workspaces, setWorkspaces] = useState<Workspace[]>()
  const [error, setError] = useState<string>()

  const params = useParams<{ workspaceId: string; appId: string }>()
  const [isPending, startTransition] = useTransition()
  const { background, setBackground } = useNavigation()
  const { isAuthenticated } = useAuth()

  const workspaceId = params?.workspaceId

  useEffect(() => {
    if (!isAuthenticated) {
      setWorkspaces(undefined)
      setWorkbenches(undefined)

      return
    }
    startTransition(async () => {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)

          workbenchList()
            .then((response) => {
              if (response?.error) setError(response.error)
              if (response?.data) setWorkbenches(response.data)
            })
            .catch((error) => {
              setError(error.message)
            })
        })
        .catch((error) => {
          setError(error.message)
        })
    })
  }, [background?.workbenchId, isAuthenticated])

  const workspacesWithWorkbenches = workspaces?.filter((workspace) =>
    workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
  )

  const sortedWorkspacesWithWorkbenches = workspacesWithWorkbenches?.sort(
    (a, b) => (a.id === workspaceId ? 1 : 0)
  )
  // Transform the static services data
  const services = customServices.map((app) => ({
    title: app.name,
    href: `/services/${app.id}`,
    description: app.description
  }))

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
      </div>

      <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                My Workspace
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/workspaces" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Workspaces
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/app-store" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                App Store
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Open Desktops</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
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
                </li>
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
                          title={workbench.name}
                          href={`/workspaces/${workbench.workspaceId}/${workbench.id}`}
                        >
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
                          {formatDistanceToNow(workbench.createdAt)} ago
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
          {additionalHeaderButtons}
          <HeaderButtons />
        </div>
      </div>
    </nav>
  )
}
