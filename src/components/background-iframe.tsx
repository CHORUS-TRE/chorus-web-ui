'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useUrlProbing } from '@/components/hooks/use-url-probing'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { workbenchStreamUrl } from '~/view-model/workbench-view-model'

import { useWorkbenchStatus } from './hooks/use-workbench-status'
import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const [url, setUrl] = useState<string | null>(null)
  const { user } = useAuthentication()
  const { background } = useAppState()
  const pathname = usePathname()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const { isLoading, error } = useUrlProbing(background?.sessionId)

  const { status: workbenchStatus } = useWorkbenchStatus(background?.sessionId)

  useEffect(() => {
    const sessionId = background?.sessionId
    if (!sessionId) return

    const fetchUrl = async () => {
      const result = await workbenchStreamUrl(sessionId)
      if (result.data) {
        setUrl(result.data)
      }
    }
    fetchUrl()
  }, [background?.sessionId])

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
        <div className="fixed left-1/2 top-2/3 z-20 -translate-x-1/2 -translate-y-1/2 transform text-gray-400">
          {error.message}
        </div>
      )}

      {workbenchStatus && (
        <div
          className={`fixed bottom-3 right-3 z-30 h-2 w-2 animate-pulse rounded-full ${
            workbenchStatus === 'Running' ? 'bg-green-500' : 'bg-red-500'
          }`}
          aria-label={`Workbench status: ${workbenchStatus}`}
          title={`Workbench status: ${workbenchStatus}`}
        />
      )}

      <iframe
        title="Application Workspace"
        src={isLoading ? 'about:blank' : url || 'about:blank'}
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
