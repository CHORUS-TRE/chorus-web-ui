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

  useEffect(() => {
    if (params.webappId) {
      openWebApp(params.webappId)
      setActiveIframe(params.webappId)
    }
  }, [params.webappId, openWebApp, setActiveIframe])

  // In Immersive Mode, the iframe is rendered by the global IframeCacheRenderer
  // We use a Flex layout to create a "Glass Frame" around the transparent center "hole"
  return null
}
