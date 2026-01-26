'use client'

import { useAppState } from '@/stores/app-state-store'
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
  const setImmersiveUIVisible = useAppState((state) => state.setImmersiveUIVisible)

  useEffect(() => {
    if (params.sessionId && params.workspaceId) {
      openSession(params.sessionId, params.workspaceId)
      setActiveIframe(params.sessionId)
    }
  }, [params.sessionId, params.workspaceId, openSession, setActiveIframe])

  // In Immersive Mode, the iframe is rendered by the global IframeCacheRenderer
  // We use a Flex layout to create a "Glass Frame" around the transparent center "hole"
  return (
    <div
      className="flex h-full flex-col"
      onClick={() => setImmersiveUIVisible(false)}
    >
      {/* Top Glass Bar (Header) */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Glass Pillar */}
        <div className="w-4 flex-none border-r border-muted/20 bg-contrast-background/50 backdrop-blur-md sm:w-8" />

        {/* The HOLE (Transparent Center) */}
        <div className="relative flex-1 overflow-auto bg-transparent">
          {/* Content goes here if needed */}
        </div>

        {/* Right Glass Pillar */}
        <div className="w-4 flex-none border-l border-muted/20 bg-contrast-background/50 backdrop-blur-md sm:w-8" />
      </div>

      {/* Bottom Glass Bar */}
      <div className="h-4 flex-none rounded-b-xl border-t border-muted/20 bg-contrast-background/50 backdrop-blur-md sm:h-8" />
    </div>
  )
}
