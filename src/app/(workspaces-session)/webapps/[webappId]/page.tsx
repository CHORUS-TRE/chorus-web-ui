'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'

/**
 * Page for displaying an external web app in a cached iframe.
 * The actual iframe rendering is handled by IframeCacheRenderer in the layout.
 */
export default function WebAppPage() {
  const params = useParams<{ webappId: string }>()
  const { openWebApp, setActiveIframe } = useIframeCache()
  const setImmersiveUIVisible = useAppState(
    (state) => state.setImmersiveUIVisible
  )

  useEffect(() => {
    if (params.webappId) {
      openWebApp(params.webappId)
      setActiveIframe(params.webappId)
    }
  }, [params.webappId, openWebApp, setActiveIframe])

  // In Immersive Mode, the iframe is rendered by the global IframeCacheRenderer
  // We use a Flex layout to create a "Glass Frame" around the transparent center "hole"
  return (
    <div
      className="flex h-full cursor-pointer flex-col"
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
