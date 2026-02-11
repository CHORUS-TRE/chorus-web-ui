'use client'

import {
  CheckCircle2,
  LaptopMinimal,
  Loader2,
  Maximize,
  Rocket,
  Settings,
  Trash2,
  UserPlus,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Button } from '@/components/button'
import { useAppInstanceStatus } from '@/components/hooks/use-app-instance-status'
import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
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
import { useFullscreenContext } from '@/providers/fullscreen-provider'

import { AppLaunchToastContent } from './app-launch-toast'

// --- Internal sub-components ---

function AppLaunchingPill({
  initialInstance
}: {
  initialInstance: AppInstance
}) {
  const { data: statusData } = useAppInstanceStatus(initialInstance.id)
  const currentStatus = statusData?.status || initialInstance.k8sStatus

  // If it reached a terminal state, show active indicator only
  if (
    currentStatus === K8sAppInstanceStatus.RUNNING ||
    currentStatus === K8sAppInstanceStatus.COMPLETE ||
    currentStatus === K8sAppInstanceStatus.FAILED ||
    currentStatus === K8sAppInstanceStatus.STOPPED ||
    currentStatus === K8sAppInstanceStatus.KILLED
  ) {
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
  onDelete
}: {
  sessionId: string
  workbenches: Workbench[] | undefined
  onDelete: (id: string) => void
}) {
  const session = workbenches?.find((wb) => wb.id === sessionId)
  const { data: statusData } = useWorkbenchStatus(sessionId)

  if (!session) return null

  const currentStatus = statusData?.status || session.serverPodStatus
  const currentMessage = statusData?.message || session.serverPodMessage
  const isRunning = currentStatus === WorkbenchServerPodStatus.READY

  return (
    <div className="space-y-2 p-3 pb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
        Session
      </p>

      <div className="space-y-2">
        <div className="group/session flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
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
              className="h-6 w-6 opacity-75 transition-opacity hover:bg-white/5 group-hover/session:opacity-100"
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
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
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
  onClose
}: {
  instance: AppInstance
  apps: App[] | undefined
  onClose: (id: string, name: string) => void
}) {
  const { data: statusData } = useAppInstanceStatus(instance.id)

  const appName =
    apps?.find((a) => a.id === instance.appId)?.name || instance.name || 'App'
  const appIcon =
    apps?.find((a) => a.id === instance.appId)?.iconURL || 'Rocket'

  const currentStatus = statusData?.status || instance.k8sStatus
  const currentMessage = statusData?.message || instance.k8sMessage
  const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING

  return (
    <div className="space-y-2">
      <div className="group/app flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
            {appIcon ? (
              <img src={appIcon} alt={appName} className="h-3 w-3" />
            ) : (
              <Rocket className="h-3 w-3 text-[#88b04b]" />
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
            className="h-6 w-6 opacity-90 transition-opacity hover:bg-white/5 group-hover/app:opacity-100"
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
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
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

// --- Main exported components ---

export interface SessionPillProps {
  sessionId: string
  sessionName: string
  launchingApps: AppInstance[]
  getAppName: (appId: string) => string
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
  getAppName,
  apps,
  appInstances,
  workbenches,
  onDeleteSession,
  onUpdateSession,
  onCloseAppInstance
}: SessionPillProps) {
  const router = useRouter()
  const { toggleFullscreen } = useFullscreenContext()
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const handleAppDone = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id))
  }, [])

  const visibleLaunchingApps = launchingApps.filter(
    (a) => !dismissedIds.has(a.id)
  )

  const getSessionApps = (sid: string): AppInstance[] => {
    return (
      appInstances?.filter((instance) => instance.workbenchId === sid) || []
    )
  }

  const session = workbenches?.find((wb) => wb.id === sessionId)

  const menuContent = () => {
    if (!session) return null

    const appsRunning = getSessionApps(sessionId)

    return (
      <div className="flex min-w-[260px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1a1b23] shadow-2xl">
        <SessionStatusSection
          sessionId={sessionId}
          workbenches={workbenches}
          onDelete={onDeleteSession}
        />

        {/* Applications Section */}
        <div className="space-y-4 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Applications
          </p>

          {appsRunning.length > 0 ? (
            <div className="space-y-4">
              {appsRunning.map((instance: AppInstance) => (
                <AppInstanceStatusRow
                  key={instance.id}
                  instance={instance}
                  apps={apps}
                  onClose={onCloseAppInstance}
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

        <div className="h-px bg-white/5" />

        {/* Actions Section */}
        <div className="space-y-0.5 p-1.5">
          <button
            onClick={() =>
              router.push(
                `/workspaces/${session.workspaceId}/sessions/${sessionId}/app-store`
              )
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-black/80"
          >
            <Rocket className="h-4 w-4" style={{ color: 'inherit' }} />
            Launch an app
          </button>

          <button
            onClick={() =>
              router.push(`/workspaces/${session.workspaceId}/users`)
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-black/80"
          >
            <UserPlus className="h-4 w-4" style={{ color: 'inherit' }} />
            Add Member
          </button>

          <button
            onClick={() => onUpdateSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-black/80"
          >
            <Settings className="h-4 w-4" style={{ color: 'inherit' }} />
            Settings
          </button>

          <button
            onClick={toggleFullscreen}
            disabled
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-accent/60 transition-all hover:bg-accent hover:text-black/80 disabled:opacity-40"
          >
            <Maximize className="h-4 w-4" style={{ color: 'inherit' }} />
            Fullscreen
          </button>
        </div>

        {/* Delete Section */}
        <div className="mt-auto border-t border-white/5 bg-red-500/5 p-1.5">
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
    <div className="group/pill relative flex h-9 items-center shadow-lg backdrop-blur-md">
      {/* Left: Logo + Session Name & Status */}
      <div className="flex items-center gap-1.5 pr-2">
        {launchingApps.length > 0 ? (
          <AppLaunchingPill initialInstance={launchingApps[0]} />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-accent" />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <p className="truncate text-[13px] font-bold leading-tight text-white">
          {sessionName}
        </p>
      </div>

      {/* Vertical Separator */}
      <div className="ml-2 h-5 w-px bg-white/50" />

      {/* Right: MENU Trigger via NavigationMenu */}
      <NavigationMenu className="z-50">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="mr-0.5 flex h-7 items-center gap-2 rounded-full border-none bg-transparent px-3 pt-0.5 text-[11px] font-black tracking-widest text-accent shadow-none hover:bg-transparent hover:text-accent data-[state=open]:bg-transparent">
              MENU
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!left-auto !right-0 !translate-x-0 border-none bg-transparent p-0 shadow-none">
              {menuContent()}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Floating app launch status panel */}
      {visibleLaunchingApps.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[260px] space-y-1.5 rounded-2xl border border-white/5 bg-[#1a1b23] p-3 shadow-2xl">
          {visibleLaunchingApps.map((instance) => (
            <AppLaunchToastContent
              key={instance.id}
              appInstanceId={instance.id}
              appName={getAppName(instance.appId)}
              appIconUrl={apps?.find((a) => a.id === instance.appId)?.iconURL}
              onDone={() => handleAppDone(instance.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
