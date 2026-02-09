'use client'

import { AlertCircle, Circle, Loader2, Square, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { cn, parseK8sInsufficientResourceMessage } from '@/lib/utils'
import { useAppState } from '@/stores/app-state-store'
import {
  deleteAppInstance,
  listAppInstances
} from '@/view-model/app-instance-view-model'
import { Button } from '~/components/button'
import { AppInstance, K8sAppInstanceStatus } from '~/domain/model/app-instance'

const POLLING_INTERVAL = 2000

function InstanceEntry({
  instance,
  appName,
  onStop
}: {
  instance: AppInstance
  appName: string
  onStop: (id: string) => Promise<void>
}) {
  const [stopping, setStopping] = useState(false)
  const k8s = instance.k8sStatus

  const isRunning = k8s === K8sAppInstanceStatus.RUNNING
  const isFailed = k8s === K8sAppInstanceStatus.FAILED
  const isLoading =
    !isRunning &&
    !isFailed &&
    k8s !== K8sAppInstanceStatus.STOPPED &&
    k8s !== K8sAppInstanceStatus.KILLED

  const handleStop = async () => {
    setStopping(true)
    await onStop(instance.id)
    setStopping(false)
  }

  return (
    <div className="flex items-center gap-2 border-b border-muted/10 px-2 py-1.5 last:border-b-0">
      {/* Status icon */}
      <div className="flex w-3 shrink-0 items-center justify-center">
        {isLoading && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
        {isRunning && (
          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
        )}
        {isFailed && <AlertCircle className="h-3 w-3 text-destructive" />}
      </div>

      {/* App name + error message */}
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-xs',
            isFailed && 'text-destructive'
          )}
        >
          {appName}
        </span>
        {isFailed && instance.k8sMessage && (
          <p className="truncate text-[10px] text-destructive/70">
            {parseK8sInsufficientResourceMessage(instance.k8sMessage)}
          </p>
        )}
      </div>

      {/* Stop button for all non-stopped/killed instances */}
      {!isFailed && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
          onClick={handleStop}
          disabled={stopping}
          title="Stop app"
        >
          <Square className="h-2.5 w-2.5" />
        </Button>
      )}
    </div>
  )
}

export function LaunchingAppsPanel() {
  const pathname = usePathname()
  const apps = useAppState((s) => s.apps)
  const appInstances = useAppState((s) => s.appInstances)
  const refreshAppInstances = useAppState((s) => s.refreshAppInstances)
  const [dismissed, setDismissed] = useState(false)

  const workbenchId = useMemo(() => {
    const match = pathname.match(/\/sessions\/([^/]+)$/)
    return match ? match[1] : null
  }, [pathname])

  const getAppName = useCallback(
    (appId: string) => apps?.find((a) => a.id === appId)?.name ?? 'App',
    [apps]
  )

  // Poll app instances while on a session page
  useEffect(() => {
    if (!workbenchId) return

    const fetchInstances = async () => {
      const result = await listAppInstances()
      if (result.data) {
        refreshAppInstances()
      }
    }

    fetchInstances()
    const interval = setInterval(fetchInstances, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [workbenchId, refreshAppInstances])

  // Reset dismissed state when workbench changes or new instances appear
  useEffect(() => {
    setDismissed(false)
  }, [workbenchId])

  const filteredInstances = useMemo(() => {
    if (!appInstances || !workbenchId) return []
    return appInstances.filter(
      (i) =>
        i.workbenchId === workbenchId &&
        i.k8sStatus !== K8sAppInstanceStatus.RUNNING &&
        i.k8sStatus !== K8sAppInstanceStatus.STOPPED &&
        i.k8sStatus !== K8sAppInstanceStatus.KILLED &&
        i.k8sStatus !== K8sAppInstanceStatus.COMPLETE
    )
  }, [appInstances, workbenchId])

  const handleStop = useCallback(
    async (id: string) => {
      const result = await deleteAppInstance(id)
      if (result.error) {
        console.error('Failed to stop app instance', id, result.error)
      }
      await refreshAppInstances()
    },
    [refreshAppInstances]
  )

  if (!workbenchId || filteredInstances.length === 0 || dismissed) return null

  return (
    <div className="fixed right-4 top-14 z-40 w-60 overflow-hidden rounded-lg border border-muted/40 bg-contrast-background/90 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-muted/20 px-2 py-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            Applications ({filteredInstances.length})
          </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filteredInstances.map((instance) => (
          <InstanceEntry
            key={instance.id}
            instance={instance}
            appName={getAppName(instance.appId)}
            onStop={handleStop}
          />
        ))}
      </div>
    </div>
  )
}
