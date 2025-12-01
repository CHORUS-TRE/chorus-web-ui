'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'

/**
 * Page for displaying an external web app in a cached iframe.
 * The actual iframe rendering is handled by IframeCacheRenderer in the layout.
 */
export default function WebAppPage() {
  const params = useParams<{ webappId: string }>()
  const { openWebApp, setActiveIframe } = useIframeCache()

  useEffect(() => {
    if (params.webappId) {
      openWebApp(params.webappId)
      setActiveIframe(params.webappId)
    }
  }, [params.webappId, openWebApp, setActiveIframe])

  // The iframe is rendered by IframeCacheRenderer in the layout
  // This page just needs to set the active iframe
  return null
}
