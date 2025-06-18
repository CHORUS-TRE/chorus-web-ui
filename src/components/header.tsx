'use client'
import { formatDistance } from 'date-fns'
import {
  AppWindow,
  Box,
  CircleHelp,
  Package,
  Search,
  Store,
  User
} from 'lucide-react'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
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

export function Header() {
  const router = useRouter()
  const paths = usePathname()
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

        {isAuthenticated && (
          <>
            <NavigationMenu className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
              <NavigationMenuList className="flex items-center justify-center gap-3">
                <NavigationMenuItem id="getting-started-step3">
                  {!isInAppContext && (
                    <NavLink
                      href={
                        background?.workspaceId
                          ? `/workspaces/${background?.workspaceId}`
                          : '/'
                      }
                      className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                      exact={false}
                      enabled={paths === '/' || paths === ''}
                    >
                      <div className="mt-1 flex place-items-center gap-1">
                        <Box className="h-4 w-4" />
                        {background?.workspaceId
                          ? workspaces?.find(
                              (w) => w.id === background?.workspaceId
                            )?.name
                          : 'My Workspace'}
                      </div>
                    </NavLink>
                  )}
                </NavigationMenuItem>
                {isInAppContext && currentWorkbench && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <NavLink
                        href={
                          background?.workspaceId
                            ? `/workspaces/${background?.workspaceId}`
                            : '/'
                        }
                        className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                        exact={false}
                      >
                        <div className="mt-1 flex place-items-center gap-1">
                          <Box className="h-4 w-4" />
                          {background?.workspaceId
                            ? workspaces?.find(
                                (w) => w.id === background?.workspaceId
                              )?.name
                            : 'My Workspace'}
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
                                        currentWorkbench.id
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
                  </NavigationMenuItem>
                )}
                {/* <NavigationMenuItem id="getting-started-step3">
                  <NavLink
                    href={`/workspaces/${user?.workspaceId}`}
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    // exact={user?.workspaceId === workspaceId}
                  >
                    <div className="mt-1 flex place-items-center gap-1">
                      <Box className="h-4 w-4" />
                      My Workspace
                    </div>
                  </NavLink>
                </NavigationMenuItem> */}
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
                    href="#"
                    className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
                    onClick={toggleRightSidebar}
                  >
                    <div className="mt-1 flex place-items-center gap-1">
                      <CircleHelp className="h-4 w-4" />
                      Help
                    </div>
                  </NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
                id="search-input"
              />
            </div>
          )}

          <div className="ml-1 flex items-center gap-2">
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="overflow-hidden text-muted hover:bg-inherit hover:text-accent"
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
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push('/users/me')}
                      >
                        {user?.firstName} {user?.lastName} profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push('/admin/users')}
                      >
                        User Management
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-500" />
                      <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className="cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push('/login')}
                      >
                        Login
                      </DropdownMenuItem>
                      {internalLogin && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push('/register')}
                        >
                          Register
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <WorkbenchDeleteForm
          id={params.sessionId}
          state={[deleteOpen, setDeleteOpen]}
          onSuccess={() => {
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
