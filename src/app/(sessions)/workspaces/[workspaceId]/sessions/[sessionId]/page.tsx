'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'
/**
 * Page for displaying a workbench session in a cached iframe.
 * In normal mode: iframe appears in the content area
 * In fullscreen mode: iframe takes full window under header
 */
export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { openSession, setActiveIframe, cachedIframes } = useIframeCache()
  const setImmersiveUIVisible = useAppState(
    (state) => state.setImmersiveUIVisible
  )

  useEffect(() => {
    if (params.sessionId && params.workspaceId) {
      openSession(params.sessionId, params.workspaceId)
      setActiveIframe(params.sessionId)
    }
  }, [params.sessionId, params.workspaceId, openSession, setActiveIframe])

  // In Immersive Mode, the iframe is rendered by the global IframeCacheRenderer
  // We use a Flex layout to create a "Glass Frame" around the transparent center "hole"
  return null
}
