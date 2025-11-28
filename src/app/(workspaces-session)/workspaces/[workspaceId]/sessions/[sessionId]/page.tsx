'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'

/**
 * Page for displaying a workbench session in a cached iframe.
 * The actual iframe rendering is handled by IframeCacheRenderer in the layout.
 */
export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { openSession, setActiveIframe } = useIframeCache()

  useEffect(() => {
    if (params.sessionId && params.workspaceId) {
      openSession(params.sessionId, params.workspaceId)
      setActiveIframe(params.sessionId)
    }
  }, [params.sessionId, params.workspaceId, openSession, setActiveIframe])

  // The iframe is rendered by IframeCacheRenderer in the layout
  // This page just needs to set the active iframe
  return null
}
