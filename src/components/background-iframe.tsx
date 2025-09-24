'use client'

import { env } from 'next-runtime-env'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useWorkbenchStatus } from '@/components/hooks/use-workbench-status'
import { K8sWorkbenchStatus, Workbench } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { toast } from '~/components/hooks/use-toast'

import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const { user } = useAuthentication()
  const { background } = useAppState()
  const pathname = usePathname()
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
    if (pollingError) return

    if (background?.sessionId) {
      startPolling()
    }
    return () => {
      stopPolling()
    }
  }, [background?.sessionId, startPolling, stopPolling, pollingError])

  // Memoize URL computation to prevent unnecessary recalculations
  const apiBase = env('NEXT_PUBLIC_DATA_SOURCE_API_URL') || ''
  const computedUrl = useMemo(() => {
    if (!background?.sessionId) return null

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = `${apiBase}/api/rest/v1`
    return `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.sessionId}/stream/`
  }, [background?.sessionId, apiBase])

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

  // const isReady = workbench?.k8sStatus === K8sWorkbenchStatus.RUNNING

  // Check if URL matches workspaces/[wid]/sessions/[sid] pattern
  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])

  // Show loading toast when polling starts
  useEffect(() => {
    if (isPolling) {
      toast({
        title: 'Loading session...',
        description: 'Please wait while we prepare your workspace.',
        duration: 10000 // 10 seconds
      })
    }
  }, [isPolling])

  // Show error toast when polling fails
  useEffect(() => {
    if (pollingError) {
      toast({
        title: 'Session failed to load',
        description: pollingError,
        variant: 'destructive'
      })
    }
  }, [pollingError])

  if (!background?.sessionId || !user) return null

  return (
    <>
      {isSessionPage && (
        <LoadingOverlay
          isLoading={(isPolling) || pollingError !== null}
        />
      )}
      {pollingError && (
        <div className="fixed bottom-3 right-3 z-30 text-gray-400">
          {pollingError}
        </div>
      )}
      {workbench && (
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
