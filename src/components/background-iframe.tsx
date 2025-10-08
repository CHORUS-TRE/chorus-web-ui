'use client'

import { usePathname } from 'next/navigation'
import { env } from 'next-runtime-env'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useUrlProbing } from '@/components/hooks/use-url-probing'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

import { useWorkbenchStatus } from './hooks/use-workbench-status'
import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const { user } = useAuthentication()
  const { background } = useAppState()
  const pathname = usePathname()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)

  const { isLoading, error } = useUrlProbing(background?.sessionId)

  const { status: workbenchStatus } = useWorkbenchStatus(background?.sessionId)

  // URL initialization effect
  useEffect(() => {
    if (!background?.sessionId) return

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`

    const baseAPIURL = env('NEXT_PUBLIC_API_URL')
    const computedUrl = `${baseAPIURL ? baseAPIURL : currentURL}${env('NEXT_PUBLIC_API_SUFFIX')}/workbenchs/${background.sessionId}/stream/`

    if (computedUrl !== url) {
      setUrl(computedUrl)
    }
  }, [background?.sessionId, url])

  const handleLoad = useCallback(() => {
    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }, [])

  // Check if URL matches workspaces/[wid]/sessions/[sid] pattern
  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])

  if (!background?.sessionId || !user) return null

  return (
    <>
      {isSessionPage && isLoading && <LoadingOverlay isLoading={isLoading} />}

      {error && (
        <div className="fixed bottom-3 right-3 z-30 text-gray-400">
          {error.message}
        </div>
      )}

      {workbenchStatus && (
        <div className="fixed bottom-10 right-3 z-30 text-gray-400">
          {workbenchStatus}
        </div>
      )}

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
    </>
  )
}
