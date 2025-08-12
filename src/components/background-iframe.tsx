'use client'

import { AlertCircle } from 'lucide-react'
import { env } from 'next-runtime-env'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
import { K8sWorkbenchStatus, Workbench } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

import { LoadingOverlay } from './loading-overlay'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export default function BackgroundIframe() {
  const { user } = useAuthentication()
  const { background } = useAppState()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const [workbench, setWorkbench] = useState<Workbench | null>(null)

  const {
    isPolling,
    error: pollingError,
    startPolling,
    stopPolling
  } = useWorkbenchStatus({
    workbenchId: background?.sessionId,
    onSuccess: (fetchedWorkbench) => {
      setWorkbench(fetchedWorkbench)
    },
    onError: (error) => {
      console.error('Polling failed:', error)
      stopPolling()
    },
    onTimeout: () => {
      console.error('Polling timed out.')
      stopPolling()
    }
  })

  // Start polling when sessionId is available
  useEffect(() => {
    if (background?.sessionId) {
      startPolling()
    }
    return () => {
      stopPolling()
    }
  }, [background?.sessionId, startPolling, stopPolling])

  // Memoize URL computation to prevent unnecessary recalculations
  const computedUrl = useMemo(() => {
    if (!background?.sessionId) return null

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = `${env('NEXT_PUBLIC_DATA_SOURCE_API_URL')}/api/rest/v1`
    return `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.sessionId}/stream/`
  }, [background?.sessionId])

  // URL initialization effect
  useEffect(() => {
    if (computedUrl !== url) {
      setUrl(computedUrl)
    }
  }, [computedUrl, url])

  // Focus management effect - only run when URL changes
  useEffect(() => {
    if (!url) return

    const iframe = iFrameRef.current
    if (!iframe) return

    iframe.focus()
    const focusTimeout = setTimeout(() => {
      iframe.focus()
    }, 1 * 1000)

    return () => focusTimeout && clearTimeout(focusTimeout)
  }, [url])

  // Memoize handleLoad to prevent iframe re-renders
  const handleLoad = useCallback(() => {
    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }, [])

  if (!background?.sessionId || !user) return null

  const isReady = workbench?.k8sStatus === K8sWorkbenchStatus.RUNNING

  return (
    <>
      <LoadingOverlay
        isLoading={isPolling && !isReady}
        message="Loading session, this can take a few minutes..."
        dismiss={pollingError ? true : false}
      />
      {pollingError && (
        <div className="fixed inset-0 top-11 z-30 flex items-center justify-center bg-background/80">
          <Alert variant="default" className="w-[400px] text-white">
            <AlertCircle className="mt-1 h-4 w-4 text-white" />
            <AlertTitle>Session did not load correctly</AlertTitle>
            <AlertDescription className="text-white">
              {pollingError}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {isReady && (
        <iframe
          title="Application Workspace"
          src={url ? url : 'about:blank'}
          allow="autoplay; fullscreen; clipboard-write;"
          style={{ width: '100vw', height: '100vh' }}
          className="fixed left-0 top-11 z-20 h-full w-full"
          id="workspace-iframe"
          ref={iFrameRef}
          aria-label="Application Workspace"
          onLoad={handleLoad}
          tabIndex={0}
        />
      )}
    </>
  )
}
