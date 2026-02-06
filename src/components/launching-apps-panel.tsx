'use client'

import { AlertCircle, Circle, Loader2, Square, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
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
    <div className="flex items-center gap-2 border-b border-muted/10 px-3 py-2 last:border-b-0">
      {/* Status icon */}
      <div className="flex w-4 shrink-0 items-center justify-center">
        {isLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
        {isRunning && (
          <Circle className="h-2.5 w-2.5 fill-green-500 text-green-500" />
        )}
        {isFailed && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
      </div>

      {/* App name + error message */}
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-sm',
            isFailed && 'text-destructive'
          )}
        >
          {appName}
        </span>
        {isFailed && instance.k8sMessage && (
          <p className="truncate text-xs text-destructive/70">
            {instance.k8sMessage}
          </p>
        )}
      </div>

      {/* Stop button for running instances */}
      {isRunning && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={handleStop}
          disabled={stopping}
          title="Stop app"
        >
          <Square className="h-3 w-3" />
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
        i.k8sStatus !== K8sAppInstanceStatus.STOPPED &&
        i.k8sStatus !== K8sAppInstanceStatus.KILLED
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
    <div className="fixed right-4 top-14 z-40 w-72 overflow-hidden rounded-xl border border-muted/40 bg-contrast-background/90 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-muted/20 px-3 py-2">
        <span className="text-xs font-medium text-foreground">
          Apps ({filteredInstances.length})
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="max-h-60 overflow-y-auto">
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
