'use client'

import {
  AppWindow,
  Check,
  CheckCircle2,
  LaptopMinimal,
  Loader2,
  Maximize,
  Plus,
  Settings,
  UserPlus,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAppInstanceStatus } from '@/components/hooks/use-app-instance-status'
import { useSessionSettings } from '@/components/hooks/use-session-settings'
import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
import { SessionMembersSheet } from '@/components/session-members-sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
  KEYBOARD_LAYOUT_OPTIONS,
  SessionXpraSettings,
  Workbench,
  WorkbenchServerPodStatus
} from '@/domain/model'
import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'
import { focusXpraApp, setXpraKeyboard } from '@/lib/xpra-session-registry'
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

// Dimmed by default, revealed on hover/focus of the containing group/session
// or group/app row. Arms on first click (shows Cancel/Confirm) rather than
// deleting immediately.
function ConfirmDeleteButton({
  onConfirm,
  title
}: {
  onConfirm: () => void
  title: string
}) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            setConfirming(false)
          }}
          title="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            onConfirm()
          }}
          title="Confirm delete"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground/40 opacity-60 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover/app:opacity-100 group-hover/session:opacity-100"
      onClick={(e) => {
        e.stopPropagation()
        setConfirming(true)
      }}
      title={title}
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  )
}

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
            <ConfirmDeleteButton
              onConfirm={() => onDelete(sessionId)}
              title="Delete Session"
            />
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
  onFocusApp
}: {
  instance: AppInstance
  apps: App[] | undefined
  status: K8sAppInstanceStatus | undefined
  message: string | undefined
  onClose: (id: string, name: string) => void
  onFocusApp: (candidates: string[], dockerImageName?: string) => void
}) {
  const app = apps?.find((a) => a.id === instance.appId)
  const appName = app?.name || instance.name || 'App'
  const appIcon = app?.iconURL || 'AppWindow'

  const currentStatus = status || instance.k8sStatus
  const currentMessage = message || instance.k8sMessage
  const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING

  const handleFocus = () => {
    if (!isRunning) return
    onFocusApp([appName, instance.appId], app?.dockerImageName)
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'group/app -mx-1.5 flex items-center justify-between rounded-lg px-1.5 py-1 transition-colors',
          isRunning && 'cursor-pointer hover:bg-accent/10'
        )}
        role={isRunning ? 'button' : undefined}
        tabIndex={isRunning ? 0 : undefined}
        onClick={handleFocus}
        onKeyDown={(e) => {
          if (isRunning && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleFocus()
          }
        }}
      >
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
          <ConfirmDeleteButton
            onConfirm={() => onClose(instance.id, appName)}
            title="Close app"
          />
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

const inputSelectClass =
  'h-8 rounded-md border border-border bg-background px-2 text-[11px] text-muted-foreground'

export function SessionInputSection({ sessionId }: { sessionId: string }) {
  const { settings, update } = useSessionSettings(sessionId)
  const set = (patch: Partial<SessionXpraSettings>) => update(patch)

  return (
    <div className="space-y-3 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
        Input
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="pill-keyboard-layout"
            className="text-[11px] font-normal text-muted-foreground"
          >
            Keyboard layout
          </Label>
          <select
            id="pill-keyboard-layout"
            className={inputSelectClass}
            value={settings.keyboardLayout}
            onChange={(e) => set({ keyboardLayout: e.target.value })}
          >
            <option value="">Automatic</option>
            {KEYBOARD_LAYOUT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="pill-swap-keys"
            className="text-[11px] font-normal text-muted-foreground"
          >
            Swap cmd / ctrl
          </Label>
          <input
            id="pill-swap-keys"
            type="checkbox"
            checked={settings.swapKeys}
            onChange={(e) => set({ swapKeys: e.target.checked })}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="pill-on-screen-keyboard"
            className="text-[11px] font-normal text-muted-foreground"
          >
            On-screen keyboard
          </Label>
          <input
            id="pill-on-screen-keyboard"
            type="checkbox"
            checked={settings.onScreenKeyboard}
            onChange={(e) => {
              console.log('[osk] 1. checkbox changed', {
                sessionId,
                checked: e.target.checked
              })
              set({ onScreenKeyboard: e.target.checked })
              setXpraKeyboard(sessionId, e.target.checked)
            }}
          />
        </div>
      </div>
    </div>
  )
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
  const [membersOpen, setMembersOpen] = useState(false)

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

  const handleFocusApp = (candidates: string[], dockerImageName?: string) => {
    focusXpraApp(sessionId, candidates, dockerImageName)
    setMenuValue('')
  }

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
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Applications
            </p>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-accent/40 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground"
              title="Launch a new app"
              onClick={() =>
                router.push(
                  `/workspaces/${session.workspaceId}/sessions/${sessionId}/app-store`
                )
              }
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

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
                  onFocusApp={handleFocusApp}
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

        <SessionInputSection sessionId={sessionId} />

        <div className="h-px bg-border/50" />

        {/* Actions Section */}
        <div className="space-y-0.5 p-1.5">
          <button
            onClick={() => setMembersOpen(true)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserPlus className="h-4 w-4" style={{ color: 'inherit' }} />
            Add Member
          </button>

          <button
            onClick={() => onUpdateSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
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
      </div>
    )
  }

  return (
    <div className="group/pill relative flex h-9">
      {/* Left: Logo + Status */}
      <div className="flex items-center">
        {launchingApps.length > 0 ? (
          <AppLaunchingPill initialInstance={launchingApps[0]} />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-accent" />
        )}
      </div>

      {/* Watch every app instance's status regardless of menu open state */}
      {sessionApps.map((instance) => (
        <AppStatusWatcher
          key={instance.id}
          instance={instance}
          onStatus={handleAppStatus}
        />
      ))}

      {/* Session Name + Menu Trigger via NavigationMenu — the whole title
          is the hover/click target, not just the "menu" label */}
      <NavigationMenu
        className="z-50 min-w-0"
        value={menuValue}
        onValueChange={setMenuValue}
      >
        <NavigationMenuList>
          <NavigationMenuItem value={MENU_ITEM_VALUE}>
            <NavigationMenuTrigger
              onClick={(e) => e.preventDefault()}
              className="mr-0.5 flex h-7 min-w-0 items-center px-1.5 text-sm text-accent"
            >
              <span className="truncate">{sessionName}</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!left-auto !right-0 !translate-x-0 p-0 shadow-none">
              {menuContent()}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {session && session.workspaceId && (
        <SessionMembersSheet
          open={membersOpen}
          onOpenChange={setMembersOpen}
          workspaceId={session.workspaceId}
          session={session}
        />
      )}
    </div>
  )
}
