'use client'

import { formatDistanceToNow } from 'date-fns'
import { Bell, HelpCircle } from 'lucide-react'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'

import { WorkbenchDeleteForm } from '@/components/forms/workbench-delete-form'
import { WorkbenchUpdateForm } from '@/components/forms/workbench-update-form'
import { toast } from '@/components/hooks/use-toast'
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
  AppInstance,
  K8sAppInstanceStatus,
  WorkbenchServerPodStatus
} from '@/domain/model'
import { useInstanceLogo } from '@/hooks/use-instance-config'
import { isSessionPath } from '@/lib/route-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { deleteAppInstance } from '@/view-model/app-instance-view-model'
import { AppBreadcrumb } from '~/components/ui/app-breadcrumb'

import { RecentTabs } from './recent-tabs'
import { SessionPill } from './session-pill'
import { UserProfileSection } from './user-profile-section'

export function Header() {
  const router = useRouter()
  const {
    workbenches,
    workspaces,
    apps,
    appInstances,
    refreshAppInstances,
    refreshWorkbenches,
    unreadNotificationsCount
  } = useAppState()
  const instanceLogo = useInstanceLogo()
  const {
    background,
    setActiveIframe,
    closeIframe,
    recentSessions,
    recentWebApps,
    removeFromRecent
  } = useIframeCache()
  const { user } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateSessionId, setUpdateSessionId] = useState<string | null>(null)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme } = useTheme()
  const defaultLogo = theme === 'light' ? logoBlack : logoWhite
  const logo = theme === 'light' ? instanceLogo?.light : instanceLogo?.dark
  const { toggleRightSidebar } = useUserPreferences()
  const pathname = usePathname()

  // Track launching apps for the current session
  const launchingApps = useMemo(() => {
    if (!params.sessionId || !appInstances) return []
    // Items that are actively starting up
    return appInstances.filter(
      (i) =>
        i.workbenchId === params.sessionId &&
        (i.k8sStatus === K8sAppInstanceStatus.PROGRESSING ||
          i.k8sStatus === K8sAppInstanceStatus.UNKNOWN ||
          i.k8sStatus === K8sAppInstanceStatus.EMPTY ||
          !i.k8sStatus)
    )
  }, [params.sessionId, appInstances])

  // Automatically open menu when a new app is launching or session is starting
  const prevLaunchingAppsCount = useRef(0)
  const prevSessionId = useRef<string | null>(null)

  useEffect(() => {
    // If we have more launching apps than before, or we switched to a new session that is starting
    const hasMoreLaunchingApps =
      launchingApps.length > prevLaunchingAppsCount.current

    const session = workbenches?.find((wb) => wb.id === params.sessionId)
    const isNewSessionStarting =
      params.sessionId !== prevSessionId.current &&
      session &&
      session.serverPodStatus !== WorkbenchServerPodStatus.READY

    if (hasMoreLaunchingApps || isNewSessionStarting) {
      setIsMenuOpen(true)
    }

    prevLaunchingAppsCount.current = launchingApps.length
    prevSessionId.current = params.sessionId || null
  }, [launchingApps.length, params.sessionId, workbenches])

  const getAppName = (appId: string) =>
    apps?.find((a) => a.id === appId)?.name ?? 'App'

  // Get display name for a session (app names if running, otherwise session name)
  const getSessionDisplayName = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    return session?.name || `Session ${sessionId?.slice(0, 8)}`
  }

  const closeAppInstance = async (id: string, name?: string) => {
    const result = await deleteAppInstance(id)
    if (result.error) {
      toast({
        title: 'Error closing app',
        description: result.error,
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'App closed',
      description: `${name || 'App'} has been closed`
    })
    refreshAppInstances()
  }

  return (
    <>
      <nav
        className="flex h-11 min-w-full flex-nowrap items-center justify-between gap-2 border-b border-muted/40 bg-contrast-background/80 px-2 text-foreground shadow-lg backdrop-blur-sm"
        id="header"
      >
        {/* Left: Logo & Session Pill */}
        <div className="flex shrink-0 items-center">
          <Link href="/" variant="muted" className="shrink-0">
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
                width={75}
                className="ml-4 aspect-[80/33] cursor-pointer"
                id="logo"
                priority
              />
            )}
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <AppBreadcrumb />
              {isSessionPath(pathname) && params.sessionId && (
                <SessionPill
                  sessionId={params.sessionId}
                  sessionName={getSessionDisplayName(params.sessionId)}
                  launchingApps={launchingApps}
                  getAppName={getAppName}
                  apps={apps}
                  appInstances={appInstances}
                  workbenches={workbenches}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  onDeleteSession={setDeleteSessionId}
                  onUpdateSession={setUpdateSessionId}
                  onCloseAppInstance={closeAppInstance}
                />
              )}
            </div>
          )}
        </div>

        {/* Center: Recent sessions and web apps as Tabs */}
        <div className="flex h-full w-full min-w-0 items-end justify-end self-stretch">
          {user && (recentSessions.length > 0 || recentWebApps.length > 0) && (
            <RecentTabs
              recentSessions={recentSessions}
              recentWebApps={recentWebApps}
              workbenches={workbenches}
              apps={apps}
              appInstances={appInstances}
            />
          )}
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex shrink-0 items-center justify-end gap-2">
          {user && (
            <button
              onClick={() => toggleRightSidebar()}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/30"
              title="Help"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {user && (
            <button
              onClick={() => router.push(`/notifications`)}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/30"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              {unreadNotificationsCount !== undefined &&
                unreadNotificationsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-contrast-background">
                    {unreadNotificationsCount > 99
                      ? '99+'
                      : unreadNotificationsCount}
                  </span>
                )}
            </button>
          )}
          <UserProfileSection />
        </div>

        {/* Dialogs */}
        <WorkbenchDeleteForm
          id={params.sessionId}
          state={[deleteOpen, setDeleteOpen]}
          onSuccess={() => {
            closeIframe(params.sessionId)
            removeFromRecent(params.sessionId, 'session')
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

        {/* Delete dialog for header tabs */}
        {deleteSessionId && (
          <WorkbenchDeleteForm
            id={deleteSessionId}
            state={[!!deleteSessionId, () => setDeleteSessionId(null)]}
            onSuccess={() => {
              const session = workbenches?.find(
                (wb) => wb.id === deleteSessionId
              )
              router.push(`/workspaces/${workspaceId}`)
              refreshWorkbenches()

              // Remove from recent sessions bar and close iframe
              removeFromRecent(deleteSessionId, 'session')
              closeIframe(deleteSessionId)
              setDeleteSessionId(null)

              toast({
                title: 'Success!',
                description: `Session ${session?.name || ''} deleted`
              })
            }}
          />
        )}

        {currentWorkbench && (
          <WorkbenchUpdateForm
            state={[updateOpen, setUpdateOpen]}
            workbench={currentWorkbench}
            onSuccess={() => {}}
          />
        )}

        {/* Update dialog for header tabs */}
        {updateSessionId &&
          workbenches?.find((wb) => wb.id === updateSessionId) && (
            <WorkbenchUpdateForm
              state={[!!updateSessionId, () => setUpdateSessionId(null)]}
              workbench={workbenches.find((wb) => wb.id === updateSessionId)!}
              onSuccess={() => {
                refreshWorkbenches()
                setUpdateSessionId(null)
                toast({
                  title: 'Success!',
                  description: 'Session updated'
                })
              }}
            />
          )}
      </nav>

      {/* About Dialog */}
      <AlertDialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <AlertDialogContent className="glass-elevated">
          <AlertDialogHeader>
            <AlertDialogTitle>About {currentWorkbench?.name}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="cursor-default text-muted">
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
                        (instance: AppInstance) =>
                          instance.workbenchId === background?.sessionId
                      )
                      ?.map(
                        (instance: AppInstance) =>
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
