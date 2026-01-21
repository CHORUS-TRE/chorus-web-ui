'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'

/**
 * Page for displaying a workbench session in a cached iframe.
 * In normal mode: iframe appears in the content area
 * In fullscreen mode: iframe takes full window under header
 */
export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { openSession, setActiveIframe, cachedIframes } = useIframeCache()

  useEffect(() => {
    if (params.sessionId && params.workspaceId) {
      openSession(params.sessionId, params.workspaceId)
      setActiveIframe(params.sessionId)
    }
  }, [params.sessionId, params.workspaceId, openSession, setActiveIframe])

  const currentIframe = cachedIframes.get(params.sessionId)

  return (
    <div className="h-full w-full">
      {currentIframe && (
        <iframe
          id={`content-iframe-${params.sessionId}`}
          title={currentIframe.name}
          src={currentIframe.url || 'about:blank'}
          allow="autoplay; fullscreen; clipboard-write;"
          className="h-full w-full rounded-lg border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
      )}
    </div>
  )
}
