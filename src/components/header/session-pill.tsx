'use client'

import {
  CheckCircle2,
  LaptopMinimal,
  Loader2,
  Maximize,
  MoreVertical,
  Rocket,
  Settings,
  Trash2,
  UserPlus,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import { useAppInstanceStatus } from '@/components/hooks/use-app-instance-status'
import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  App,
  AppInstance,
  K8sAppInstanceStatus,
  Workbench,
  WorkbenchServerPodStatus
} from '@/domain/model'
import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'
import { useFullscreenContext } from '@/providers/fullscreen-provider'

// --- Internal sub-components ---

function AppLaunchingPill({
  initialInstance,
  getAppName
}: {
  initialInstance: AppInstance
  getAppName: (appId: string) => string
}) {
  const { data: statusData } = useAppInstanceStatus(initialInstance.id)
  const currentStatus = statusData?.status || initialInstance.k8sStatus

  // If it reached a terminal state, hide the launching status
  if (
    currentStatus === K8sAppInstanceStatus.RUNNING ||
    currentStatus === K8sAppInstanceStatus.COMPLETE ||
    currentStatus === K8sAppInstanceStatus.FAILED ||
    currentStatus === K8sAppInstanceStatus.STOPPED ||
    currentStatus === K8sAppInstanceStatus.KILLED
  ) {
    return (
      <>
        <CheckCircle2 className="h-3 w-3 text-[#88b04b]" />
        <p className="text-[10px] font-medium leading-none text-muted-foreground/60">
          Session Active
        </p>
      </>
    )
  }

  return (
    <>
      <div className="h-2 w-2 animate-pulse rounded-full bg-[#88b04b] shadow-[0_0_8px_#88b04b]" />
      <p className="text-[10px] font-bold uppercase leading-none text-[#88b04b]">
        Launching {getAppName(initialInstance.appId)}...
      </p>
    </>
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
    <div className="space-y-4 p-4 pb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
        Session
      </p>

      <div className="space-y-3">
        <div className="group/session flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
              <LaptopMinimal className="h-5 w-5 text-[#88b04b]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-white">
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

  const currentStatus = statusData?.status || instance.k8sStatus
  const currentMessage = statusData?.message || instance.k8sMessage
  const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING

  return (
    <div className="space-y-3">
      <div className="group/app flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#2a2d3a]">
            <Rocket className="h-5 w-5 text-[#88b04b]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white">
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
            className="h-6 w-6 opacity-75 transition-opacity hover:bg-white/5 group-hover/app:opacity-100"
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
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
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
  isMenuOpen,
  setIsMenuOpen,
  onDeleteSession,
  onUpdateSession,
  onCloseAppInstance
}: SessionPillProps) {
  const router = useRouter()
  const { toggleFullscreen } = useFullscreenContext()

  const getSessionApps = (sid: string): AppInstance[] => {
    return (
      appInstances?.filter((instance) => instance.workbenchId === sid) || []
    )
  }

  const session = workbenches?.find((wb) => wb.id === sessionId)

  const renderSessionMenuContent = () => {
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
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
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/workspaces/${session.workspaceId}/sessions/${sessionId}/app-store`
              )
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Rocket className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Launch an app
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/workspaces/${session.workspaceId}/users`)
            }
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <UserPlus className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Add Member
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdateSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Settings className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={toggleFullscreen}
            disabled
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            <Maximize className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-white" />
            Fullscreen
          </DropdownMenuItem>
        </div>

        {/* Delete Section */}
        <div className="mt-auto border-t border-white/5 bg-red-500/5 p-1.5">
          <DropdownMenuItem
            onClick={() => onDeleteSession(sessionId)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 text-red-400/60 transition-colors group-hover:text-red-400" />
            Delete Session
          </DropdownMenuItem>
        </div>
      </div>
    )
  }

  return (
    <div className="group/pill flex h-9 items-center rounded-xl border border-muted bg-muted/50 shadow-lg backdrop-blur-md transition-all hover:bg-muted/80">
      {/* Left: Info & Status */}
      <div className="flex min-w-0 flex-col justify-center px-4">
        <p className="truncate text-[13px] font-bold leading-tight text-white">
          {sessionName}
        </p>
        <div className="flex items-center gap-1.5">
          {launchingApps.length > 0 ? (
            <AppLaunchingPill
              initialInstance={launchingApps[0]}
              getAppName={getAppName}
            />
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 text-[#88b04b]" />
              <p className="text-[10px] font-medium leading-none text-muted-foreground/60">
                Session Active
              </p>
            </>
          )}
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="h-5 w-px bg-white/10" />

      {/* Right: MENU Trigger */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="group/menu ml-1 mr-0.5 flex h-7 items-center gap-2 rounded-full px-3 transition-colors hover:text-accent">
            <span className="text-[11px] font-black tracking-widest text-white">
              MENU
            </span>
            <MoreVertical className="h-3.5 w-3.5 text-white/80" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="mt-2 border-none bg-transparent p-0 shadow-none"
          align="end"
        >
          {renderSessionMenuContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
