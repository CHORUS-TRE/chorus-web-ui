'use client'

import {
  AppWindow,
  CheckCircle2,
  LaptopMinimal,
  Loader2,
  Maximize,
  Settings,
  Trash2,
  UserPlus,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAppInstanceStatus } from '@/components/hooks/use-app-instance-status'
import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import {
  App,
  AppInstance,
  K8sAppInstanceStatus,
  Workbench,
  WorkbenchServerPodStatus
} from '@/domain/model'
import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'
import { focusXpraApp } from '@/lib/xpra-session-registry'
import { useFullscreenContext } from '@/providers/fullscreen-provider'

const MENU_ITEM_VALUE = 'session-menu'

const TERMINAL_APP_STATUSES = new Set<K8sAppInstanceStatus>([
  K8sAppInstanceStatus.RUNNING,
  K8sAppInstanceStatus.COMPLETE,
  K8sAppInstanceStatus.FAILED,
  K8sAppInstanceStatus.STOPPED,
  K8sAppInstanceStatus.KILLED
])

// --- Internal sub-components ---

function AppLaunchingPill({
  initialInstance
}: {
  initialInstance: AppInstance
}) {
  const { data: statusData } = useAppInstanceStatus(initialInstance.id)
  const currentStatus = statusData?.status || initialInstance.k8sStatus

  // If it reached a terminal state, show active indicator only
  if (currentStatus && TERMINAL_APP_STATUSES.has(currentStatus)) {
    return <CheckCircle2 className="h-3 w-3 text-[#88b04b]" />
  }

  // Just the animated loading dot — no text
  return (
    <div className="h-2 w-2 animate-pulse rounded-full bg-[#88b04b] shadow-[0_0_8px_#88b04b]" />
  )
}

function SessionStatusSection({
  sessionId,
  workbenches,
  currentStatus,
  currentMessage,
  onDelete
}: {
  sessionId: string
  workbenches: Workbench[] | undefined
  currentStatus: WorkbenchServerPodStatus | undefined
  currentMessage: string | undefined
  onDelete: (id: string) => void
}) {
  const session = workbenches?.find((wb) => wb.id === sessionId)

  if (!session) return null

  const isRunning = currentStatus === WorkbenchServerPodStatus.READY

  return (
    <div className="space-y-2 p-3 pb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
        Session
      </p>

      <div className="space-y-2">
        <div className="group/session flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted">
              <LaptopMinimal className="h-3 w-3 text-[#88b04b]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight text-muted-foreground">
                {session.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground/60">
                {isRunning ? 'Running' : currentStatus}
              </p>
              {!isRunning && currentMessage && (
                <p className="mt-1 w-36 whitespace-normal text-[11px] leading-relaxed text-muted-foreground/60">
                  {parseK8sInsufficientResourceMessage(currentMessage)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <span className="text-[11px] font-bold text-[#88b04b]"></span>
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-75 transition-opacity hover:bg-muted group-hover/session:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(sessionId)
              }}
              title="Delete Session"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        {!isRunning && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
            <div
              className={cn(
                'h-full transition-all duration-1000',
                isRunning
                  ? 'w-full bg-[#88b04b]'
                  : 'w-1/3 animate-pulse bg-[#88b04b]/40'
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AppInstanceStatusRow({
  instance,
  apps,
  status,
  message,
  onClose,
  onFocus
}: {
  instance: AppInstance
  apps: App[] | undefined
  status: K8sAppInstanceStatus | undefined
  message: string | undefined
  onClose: (id: string, name: string) => void
  onFocus: (candidates: string[]) => void
}) {
  const appName =
    apps?.find((a) => a.id === instance.appId)?.name || instance.name || 'App'
  const appIcon =
    apps?.find((a) => a.id === instance.appId)?.iconURL || 'AppWindow'

  const currentStatus = status || instance.k8sStatus
  const currentMessage = message || instance.k8sMessage
  const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING

  return (
    <div
      className="cursor-pointer space-y-2 rounded-lg p-1 transition-colors hover:bg-muted/50"
      onClick={() => onFocus([appName, instance.name || '', instance.appId])}
      title={`Bring ${appName} to front`}
    >
      <div className="group/app flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted">
            {appIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={appIcon} alt={appName} className="h-3 w-3" />
            ) : (
              <AppWindow className="h-3 w-3 text-[#88b04b]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight text-muted-foreground">
              {appName}
            </p>
            <p className="truncate text-[11px] text-muted-foreground/60">
              {isRunning ? 'Running' : currentStatus}
            </p>
            {!isRunning && (
              <p className="mt-1 w-36 whitespace-normal text-[11px] leading-relaxed text-muted-foreground/60">
                {parseK8sInsufficientResourceMessage(currentMessage)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="text-[11px] font-bold text-[#88b04b]"></span>
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-90 transition-opacity hover:bg-muted group-hover/app:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onClose(instance.id, appName)
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      {!isRunning && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className={cn(
              'h-full transition-all duration-1000',
              isRunning
                ? 'w-full bg-[#88b04b]'
                : 'w-1/3 animate-pulse bg-[#88b04b]/40'
            )}
          />
        </div>
      )}
    </div>
  )
}

// Polls one app instance's status regardless of whether the menu is open,
// so status changes can be detected (and the menu opened) even while closed.
function AppStatusWatcher({
  instance,
  onStatus
}: {
  instance: AppInstance
  onStatus: (
    id: string,
    status: K8sAppInstanceStatus | undefined,
    message: string | undefined
  ) => void
}) {
  const { data } = useAppInstanceStatus(instance.id)
  const status = data?.status || instance.k8sStatus
  const message = data?.message || instance.k8sMessage

  useEffect(() => {
    onStatus(instance.id, status, message)
  }, [instance.id, status, message, onStatus])

  return null
}

// --- Main exported components ---

export interface SessionPillProps {
  sessionId: string
  sessionName: string
  launchingApps: AppInstance[]
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined
  workbenches: Workbench[] | undefined
  onDeleteSession: (id: string) => void
  onUpdateSession: (id: string) => void
  onCloseAppInstance: (id: string, name?: string) => Promise<void>
}

export function SessionPill({
  sessionId,
  sessionName,
  launchingApps,
  apps,
  appInstances,
  workbenches,
  onDeleteSession,
  onUpdateSession,
  onCloseAppInstance
}: SessionPillProps) {
  const router = useRouter()
  const { toggleFullscreen } = useFullscreenContext()
  const [menuValue, setMenuValue] = useState('')

  const session = workbenches?.find((wb) => wb.id === sessionId)
  const { data: sessionStatusData } = useWorkbenchStatus(sessionId)
  const sessionStatus = sessionStatusData?.status || session?.serverPodStatus
  const sessionMessage = sessionStatusData?.message || session?.serverPodMessage

  const sessionApps =
    appInstances?.filter((instance) => instance.workbenchId === sessionId) || []
  const sessionAppIds = sessionApps.map((a) => a.id).join(',')

  // Status per app instance, polled by the always-mounted AppStatusWatchers
  // below (not the menu content, which unmounts while closed).
  const [appStatuses, setAppStatuses] = useState<
    Record<string, { status?: K8sAppInstanceStatus; message?: string }>
  >({})

  const handleAppStatus = useCallback(
    (
      id: string,
      status: K8sAppInstanceStatus | undefined,
      message: string | undefined
    ) => {
      setAppStatuses((prev) => {
        const existing = prev[id]
        if (existing?.status === status && existing?.message === message) {
          return prev
        }
        return { ...prev, [id]: { status, message } }
      })
    },
    []
  )

  // Drop status entries for app instances no longer in this session
  useEffect(() => {
    const currentIds = new Set(sessionAppIds ? sessionAppIds.split(',') : [])
    setAppStatuses((prev) => {
      let changed = false
      const next: typeof prev = {}
      for (const id of Object.keys(prev)) {
        if (currentIds.has(id)) {
          next[id] = prev[id]
        } else {
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [sessionAppIds])

  // Open the menu whenever the session's or an app's status changes; close
  // it once nothing is active anymore. Manual open/close (hover) in between
  // is untouched — these effects only fire on genuine status changes.
  const statusKey = `${sessionStatus}::${sessionApps
    .map((a) => `${a.id}:${appStatuses[a.id]?.status}`)
    .join('|')}`
  const prevStatusKeyRef = useRef(statusKey)
  useEffect(() => {
    if (statusKey !== prevStatusKeyRef.current) {
      setMenuValue(MENU_ITEM_VALUE)
    }
    prevStatusKeyRef.current = statusKey
  }, [statusKey])

  const hasActivity =
    sessionStatus !== WorkbenchServerPodStatus.READY ||
    sessionApps.some((a) => {
      const status = appStatuses[a.id]?.status
      return !status || !TERMINAL_APP_STATUSES.has(status)
    })
  const wasActiveRef = useRef(hasActivity)
  useEffect(() => {
    if (wasActiveRef.current && !hasActivity) {
      setMenuValue('')
    }
    wasActiveRef.current = hasActivity
  }, [hasActivity])

  const menuContent = () => {
    if (!session) return null

    return (
      <div className="flex min-w-[260px] flex-col overflow-hidden rounded-lg border border-border bg-popover shadow-md">
        <SessionStatusSection
          sessionId={sessionId}
          workbenches={workbenches}
          currentStatus={sessionStatus}
          currentMessage={sessionMessage}
          onDelete={onDeleteSession}
        />

        {/* Applications Section */}
        <div className="space-y-4 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Applications
          </p>

          {sessionApps.length > 0 ? (
            <div className="space-y-4">
              {sessionApps.map((instance: AppInstance) => (
                <AppInstanceStatusRow
                  key={instance.id}
                  instance={instance}
                  apps={apps}
                  status={appStatuses[instance.id]?.status}
                  message={appStatuses[instance.id]?.message}
                  onClose={onCloseAppInstance}
                  onFocus={(candidates) => {
                    focusXpraApp(sessionId, candidates)
                    setMenuValue('')
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-2">
              <p className="text-[11px] italic text-muted-foreground/40">
                No apps active in this session
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-border/50" />

        {/* Actions Section */}
        <div className="space-y-0.5 p-1.5">
          <button
            onClick={() =>
              router.push(
                `/workspaces/${session.workspaceId}/sessions/${sessionId}/app-store`
              )
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <AppWindow className="h-4 w-4" style={{ color: 'inherit' }} />
            Launch an app
          </button>

          <button
            onClick={() =>
              router.push(`/workspaces/${session.workspaceId}/users`)
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserPlus className="h-4 w-4" style={{ color: 'inherit' }} />
            Add Member
          </button>

          <button
            onClick={() => onUpdateSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" style={{ color: 'inherit' }} />
            Settings
          </button>

          <button
            onClick={toggleFullscreen}
            disabled
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            <Maximize className="h-4 w-4" style={{ color: 'inherit' }} />
            Fullscreen
          </button>
        </div>

        {/* Delete Section */}
        <div className="mt-auto border-t border-border bg-red-500/5 p-1.5">
          <button
            onClick={() => onDeleteSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 text-red-400/60 transition-colors group-hover:text-red-400" />
            Delete Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <NavigationMenu
      className="z-50 max-w-none flex-none justify-start"
      value={menuValue}
      onValueChange={setMenuValue}
    >
      <NavigationMenuList className="w-full space-x-0">
        <NavigationMenuItem value={MENU_ITEM_VALUE} className="w-full">
          {/* The whole bar is the hover/click trigger, not just the "MENU" label */}
          <NavigationMenuTrigger
            onClick={(e) => e.preventDefault()}
            className="group/pill flex h-9 w-full items-center justify-start rounded-full border-none bg-transparent px-0 shadow-none backdrop-blur-md hover:bg-transparent data-[state=open]:bg-transparent"
          >
            {/* Left: Logo + Session Name & Status */}
            <div className="flex items-center gap-1.5 pr-2">
              {launchingApps.length > 0 ? (
                <AppLaunchingPill initialInstance={launchingApps[0]} />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-accent" />
              )}
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="truncate text-[13px] font-bold leading-tight text-foreground">
                {sessionName}
              </p>
            </div>

            {/* Vertical Separator */}
            <div className="ml-2 h-5 w-px bg-foreground/30" />

            <span className="ml-2 mr-0.5 text-[11px] font-black tracking-widest text-accent">
              MENU
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!left-auto !right-0 !translate-x-0 border-none bg-transparent p-0 shadow-none">
            {menuContent()}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      {/* Watch every app instance's status regardless of menu open state */}
      {sessionApps.map((instance) => (
        <AppStatusWatcher
          key={instance.id}
          instance={instance}
          onStatus={handleAppStatus}
        />
      ))}
    </NavigationMenu>
  )
}
