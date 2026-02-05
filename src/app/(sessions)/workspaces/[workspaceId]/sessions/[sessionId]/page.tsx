'use client'
import { Store } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'

/**
 * Page for displaying a workbench session in a cached iframe.
 * In normal mode: iframe appears in the content area
 * In fullscreen mode: iframe takes full window under header
 */
export default function WorkbenchPage() {
  const [noAppsRunning, setNoAppsRunning] = useState(false)
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { openSession, setActiveIframe } = useIframeCache()
  const { appInstances, refreshAppInstances } = useAppState()

  const workspaceId = params.workspaceId
  const sessionId = params.sessionId

  const sessionAppInstances = appInstances?.filter(
    (appInstance) => appInstance.workbenchId === sessionId
  )

  useEffect(() => {
    if (sessionId && workspaceId) {
      openSession(sessionId, workspaceId)
      setActiveIframe(sessionId)
    }
  }, [sessionId, workspaceId, openSession, setActiveIframe])

  useEffect(() => {
    console.log('sessionAppInstances', sessionAppInstances)
    if (sessionAppInstances?.length === 0) {
      setNoAppsRunning(true)
    } else {
      setNoAppsRunning(false)
    }
  }, [sessionAppInstances])

  useEffect(() => {
    refreshAppInstances()
  }, [refreshAppInstances])

  if (!noAppsRunning) return null

  return (
    <div className="pointer-events-none flex h-full w-full items-center justify-center p-4">
      <div className="pointer-events-auto relative isolate w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-3xl duration-500 animate-in fade-in zoom-in lg:p-12">
        {/* Decorative background gradients */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative flex flex-col items-center space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-foreground">
              Ready to work?
            </h1>
            <p className="mx-auto max-w-[320px] text-muted-foreground">
              This session is currently empty. Visit the App Store to launch
              session tools.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="accent-filled">
              <Link
                href={`/workspaces/${workspaceId}/sessions/${sessionId}/app-store`}
              >
                <Store className="mr-2 h-5 w-5" />
                Open App Store
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
