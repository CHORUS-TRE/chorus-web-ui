'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  Bell,
  CircleHelp,
  Home,
  Package,
  Search,
  Settings,
  Store,
  User
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { Separator } from '@/components/ui/separator'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import {
  ListItem,
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

  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )

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
                      <NavigationMenuTrigger className="border-none hover:border-none">
                        <NavLink
                          href={
                            background?.workspaceId
                              ? workspaces?.find(
                                  (w) => w.id === background?.workspaceId
                                )?.isMain
                                ? `/`
                                : `/workspaces/${background?.workspaceId}`
                              : '/'
                          }
                          className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                          exact={false}
                        >
                          <div className="mt-1 flex place-items-center gap-1">
                            {workspaceId &&
                            workspaceId === user?.workspaceId ? (
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
                        </NavLink>
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
                                    <div className="flex items-center gap-2 text-xs">
                                      <AppWindow className="h-4 w-4 shrink-0" />
                                      {filteredApps.join(', ') || 'No apps'}
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
                              const iframe = document.getElementById('iframe')
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
                      <div className="mt-1 flex place-items-center gap-1">
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
                  <NavLink
                    href="/workspaces"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    exact={true}
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
                <NavigationMenuItem id="getting-started-step4">
                  <NavLink
                    href="/admin"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                  >
                    <div className="mt-1 flex place-items-center gap-1">
                      <Settings className="h-4 w-4" />
                      Admin
                    </div>
                  </NavLink>
                </NavigationMenuItem>
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
              className="h-8 w-8 text-muted hover:bg-inherit hover:text-accent"
              variant="ghost"
              onClick={toggleRightSidebar}
            >
              <CircleHelp className="h-4 w-4" />
            </Button>
            {user && (
              <Button
                size="icon"
                className="h-8 w-8 overflow-hidden text-muted hover:bg-inherit hover:text-accent"
                variant="ghost"
              >
                <Bell className="h-4 w-4" />
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
                      className="cursor-pointer"
                      onClick={() => router.push('/users/me')}
                    >
                      {user?.firstName} {user?.lastName} profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => router.push('/admin/users')}
                    >
                      <Settings className="h-4 w-4" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-500" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
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
                  )}
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
