'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  FlaskConical,
  Globe,
  Info,
  LaptopMinimal,
  LogOut,
  Maximize,
  Plus,
  Settings,
  Trash2,
  User,
  UserPlus,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'

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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
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
  const {
    background,
    setActiveIframe,
    cachedIframes,
    activeIframeId,
    closeIframe
  } = useIframeCache()
  const { user, logout } = useAuthentication()
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId || user?.workspaceId
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateSessionId, setUpdateSessionId] = useState<string | null>(null)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const currentWorkbench = workbenches?.find(
    (w) => w.id === background?.sessionId
  )
  const { theme } = useTheme()
  const defaultLogo = theme === 'light' ? logoBlack : logoWhite
  const logo = theme === 'light' ? customLogos.light : customLogos.dark

  // Get loaded sessions and webapps from cache
  const loadedItems = Array.from(cachedIframes.values())
  const loadedSessions = loadedItems.filter((item) => item.type === 'session')
  const loadedWebApps = loadedItems.filter((item) => item.type === 'webapp')

  // Get display name for a session (app names if running, otherwise session name)
  const getSessionDisplayName = (sessionId: string) => {
    const sessionAppInstances = appInstances?.filter(
      (instance) => instance.workbenchId === sessionId
    )
    if (sessionAppInstances && sessionAppInstances.length > 0) {
      const appNames = sessionAppInstances
        .map((instance) => apps?.find((a) => a.id === instance.appId)?.name)
        .filter(Boolean)
      if (appNames.length > 0) {
        return appNames.join(', ')
      }
    }
    const session = workbenches?.find((wb) => wb.id === sessionId)
    return session?.name || `Session ${sessionId?.slice(0, 8)}`
  }

  // Toggle fullscreen for active iframe
  const toggleFullscreen = () => {
    if (activeIframeId) {
      const iframe = document.getElementById(`iframe-${activeIframeId}`)
      if (iframe) {
        iframe.requestFullscreen()
      }
    }
  }

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
              width={54}
              className="ml-4 aspect-auto cursor-pointer"
              id="logo"
              priority
            />
          )}
        </Link>

        {/* Center: Loaded sessions and web apps */}
        {user && (loadedSessions.length > 0 || loadedWebApps.length > 0) && (
          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-4">
            {/* Loaded Sessions */}
            {loadedSessions.map((session) => {
              const isActive = activeIframeId === session.id
              const sessionWorkbench = workbenches?.find(
                (wb) => wb.id === session.id
              )

              return (
                <HoverCard key={session.id} openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button
                          onClick={() => {
                        if (sessionWorkbench) {
                              router.push(
                            `/workspaces/${sessionWorkbench.workspaceId}/sessions/${session.id}`
                              )
                        }
                      }}
                      className={cn(
                        'group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'border-accent/50 bg-accent/20 text-accent'
                          : 'border-muted/50 bg-muted/50 text-foreground/80 hover:bg-muted hover:text-foreground'
                      )}
                        >
                      <LaptopMinimal className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-32 truncate">
                        {getSessionDisplayName(session.id)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          closeIframe(session.id)
                        }}
                        className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </button>
                  </HoverCardTrigger>
                  {isActive && sessionWorkbench && (
                    <HoverCardContent
                      className="glass-elevated w-52 p-2"
                      align="center"
                    >
                      <div className="flex flex-col gap-0.5 text-sm">
                        {/* Workspace name - clickable */}
                        {workspaces?.find(
                          (w) => w.id === sessionWorkbench.workspaceId
                        ) && (
                          <>
                            <button
                              onClick={() =>
                                router.push(
                                  `/workspaces/${sessionWorkbench.workspaceId}`
                                )
                              }
                              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                            >
                              <span className="truncate">
                                {
                                  workspaces.find(
                                    (w) => w.id === sessionWorkbench.workspaceId
                                  )?.name
                                }
                              </span>
                            </button>
                            <div className="my-1 border-t border-muted/20" />
                          </>
                        )}

                        {/* Running apps */}
                        {appInstances
                          ?.filter(
                            (instance) => instance.workbenchId === session.id
                          )
                          .map((instance) => {
                            const app = apps?.find(
                              (a) => a.id === instance.appId
                            )
                            return (
                              <div
                                key={instance.id}
                                className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                <span className="truncate">
                                  {app?.name || 'Unknown App'}
                                </span>
                              </div>
                            )
                          })}

                        {appInstances?.some(
                          (i) => i.workbenchId === session.id
                        ) && <div className="my-1 border-t border-muted/20" />}

                        {/* Actions */}
                        <button
                              onClick={() =>
                            router.push(
                              `/app-store?workspaceId=${sessionWorkbench.workspaceId}&sessionId=${session.id}`
                            )
                              }
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Start New App</span>
                        </button>

                        <button
                              onClick={() =>
                                router.push(
                              `/workspaces/${sessionWorkbench.workspaceId}/sessions/${session.id}/members`
                                )
                              }
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Add Member</span>
                        </button>

                        <button
                          onClick={() => setUpdateSessionId(session.id)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          <span>Settings</span>
                        </button>

                        <button
                          onClick={toggleFullscreen}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <Maximize className="h-3.5 w-3.5" />
                          <span>Fullscreen</span>
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/workspaces/${sessionWorkbench.workspaceId}/sessions/${session.id}`
                            )
                                    }
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <Info className="h-3.5 w-3.5" />
                          <span>Session Info</span>
                        </button>

                        <div className="my-1 border-t border-muted/20" />

                        <button
                          onClick={() => setDeleteSessionId(session.id)}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Session</span>
                        </button>
                                </div>
                    </HoverCardContent>
                  )}
                </HoverCard>
              )
            })}

            {/* Separator if both sessions and webapps */}
            {loadedSessions.length > 0 && loadedWebApps.length > 0 && (
              <div className="mx-1 h-4 w-px bg-muted/30" />
            )}

            {/* Loaded Web Apps */}
            {loadedWebApps.map((webapp) => {
              const isActive = activeIframeId === webapp.id

              return (
                <button
                  key={webapp.id}
                  onClick={() => router.push(`/webapps/${webapp.id}`)}
                  className={cn(
                    'group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'border-accent/50 bg-accent/20 text-accent'
                      : 'border-muted/50 bg-muted/50 text-foreground/80 hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="max-w-32 truncate">{webapp.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeIframe(webapp.id)
                    }}
                    className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex shrink-0 items-center justify-end">
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

        {/* Delete dialog for header tabs */}
        {deleteSessionId && (
          <WorkbenchDeleteForm
            id={deleteSessionId}
            state={[
              !!deleteSessionId,
              () => setDeleteSessionId(null)
            ]}
            onSuccess={() => {
              const session = workbenches?.find(
                (wb) => wb.id === deleteSessionId
              )
              refreshWorkbenches()
              closeIframe(deleteSessionId)
              setDeleteSessionId(null)
              router.push('/sessions')
              toast({
                title: 'Success!',
                description: `Session ${session?.name || ''} deleted`
              })
            }}
          />
        )}

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
