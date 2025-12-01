'use client'
import { formatDistanceToNow } from 'date-fns'
import { Bell, FlaskConical, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'

import { WorkbenchDeleteForm } from './forms/workbench-delete-form'
import { WorkbenchUpdateForm } from './forms/workbench-update-form'
import { toast } from './hooks/use-toast'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const router = useRouter()
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    refreshWorkbenches,
    users,
    customLogos
  } = useAppState()
  const { background, setActiveIframe } = useIframeCache()
  const { user, logout } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme } = useTheme()
  const defaultLogo = theme === 'light' ? logoBlack : logoWhite
  const logo = theme === 'light' ? customLogos.light : customLogos.dark

  return (
    <>
      <nav
        className="flex h-11 min-w-full flex-nowrap items-center justify-between gap-2 border-b border-muted/40 bg-contrast-background/80 px-2 text-foreground shadow-lg backdrop-blur-sm"
        id="header"
        onMouseLeave={() => {
          setTimeout(() => {
            document.getElementById('workspace-iframe')?.focus()
          }, 1000)
        }}
      >
        <Link href="/" variant="muted">
          <Image
            src={defaultLogo}
            alt="Chorus"
            height={32}
            width={54}
            className="aspect-auto cursor-pointer"
            id="logo"
            priority
          />
          {logo && (
            <Image
              src={logo}
              alt="Chorus"
              height={32}
              width={54}
              className="ml-4 aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          )}
        </Link>

        <div className="flex items-center justify-end">
          <div className="ml-1 flex items-center">
            <ThemeToggle />

            {user?.rolesWithContext?.some((role) => role.context.user) && (
              <Button
                variant="ghost"
                onClick={() => router.push(`/lab`)}
                aria-label="Sandbox"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Lab</span>
              </Button>
            )}
            {user && (
              <Button variant="ghost" aria-label="Notifications" disabled>
                <Bell className="h-4 w-4 text-muted" aria-hidden="true" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="glass-elevated w-56"
                  align="end"
                  forceMount
                >
                  <>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => router.push(`/users/${user?.id}`)}
                    >
                      <User className="h-4 w-4" />
                      {user?.firstName} {user?.lastName} profile
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
              setActiveIframe(null)
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
        <AlertDialogContent className="glass-elevated">
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
              <div className="text-sm">
                Workspace:{' '}
                {
                  workspaces?.find((workspace) => workspace.id === workspaceId)
                    ?.name
                }
              </div>
              <div className="text-sm">
                Apps running:{' '}
                {(() => {
                  const filteredApps =
                    appInstances
                      ?.filter(
                        (instance) =>
                          instance.workbenchId === background?.sessionId
                      )
                      ?.map(
                        (instance) =>
                          apps?.find((app) => app.id === instance.appId)?.name
                      )
                      ?.filter(Boolean) || []
                  return (
                    filteredApps.join(', ') ||
                    currentWorkbench?.name ||
                    'No apps running'
                  )
                })()}
              </div>
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
