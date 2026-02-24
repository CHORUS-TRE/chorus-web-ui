'use client'

import { AppWindow, CheckCircle2, Loader2, Rocket, XCircle } from 'lucide-react'

import { useAppInstanceStatus } from '@/components/hooks/use-app-instance-status'
import { K8sAppInstanceStatus } from '@/domain/model'
import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'

/**
 * A live-updating app launch status component designed to be rendered
 * inside the session pill floating panel. Polls via useAppInstanceStatus until terminal state.
 */
export function AppLaunchToastContent({
  appInstanceId,
  appName,
  appIconUrl,
  onDone
}: {
  appInstanceId: string
  appName: string
  appIconUrl?: string
  onDone?: () => void
}) {
  const { data: statusData, error } = useAppInstanceStatus(appInstanceId)

  const currentStatus = statusData?.status || K8sAppInstanceStatus.UNKNOWN
  const currentMessage = statusData?.message

  const isRunning = currentStatus === K8sAppInstanceStatus.RUNNING
  const isFailed = currentStatus === K8sAppInstanceStatus.FAILED
  const isComplete = currentStatus === K8sAppInstanceStatus.COMPLETE
  const isStopped =
    currentStatus === K8sAppInstanceStatus.STOPPED ||
    currentStatus === K8sAppInstanceStatus.KILLED
  const isTerminal = isRunning || isFailed || isComplete || isStopped

  // Auto-dismiss after reaching terminal state
  if (isTerminal && onDone) {
    setTimeout(onDone, 1000)
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          isRunning && 'bg-[#88b04b]/10',
          isFailed && 'bg-red-500/10',
          !isTerminal && 'bg-accent/10'
        )}
      >
        {appIconUrl ? (
          <img
            src={appIconUrl}
            alt={appName}
            className={cn('h-7 w-7 rounded', !isTerminal && 'animate-pulse')}
          />
        ) : isRunning ? (
          <CheckCircle2 className="h-7 w-7 text-[#88b04b]" />
        ) : isFailed || error ? (
          <XCircle className="h-7 w-7 text-red-500" />
        ) : (
          <AppWindow className="h-7 w-7 animate-pulse text-accent" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight">{appName}</p>
        <div className="flex items-center gap-1.5">
          {!isTerminal && !error && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
          <p
            className={cn(
              'text-xs',
              isRunning && 'text-[#88b04b]',
              isFailed && 'text-red-400',
              !isTerminal && 'text-muted-foreground'
            )}
          >
            {error
              ? 'Error'
              : isRunning
                ? 'Running'
                : isFailed
                  ? 'Failed'
                  : 'Launching...'}
          </p>
        </div>
        {(isFailed || error) && currentMessage && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            {parseK8sInsufficientResourceMessage(currentMessage)}
          </p>
        )}
      </div>
    </div>
  )
}
