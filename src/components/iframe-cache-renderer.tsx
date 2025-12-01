'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useUrlProbing } from '@/components/hooks/use-url-probing'
import { CachedIframe } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'

import { useWorkbenchStatus } from './hooks/use-workbench-status'
import { LoadingOverlay } from './loading-overlay'

/**
 * Renders a single cached iframe with proper visibility management.
 * Each iframe maintains its own state and doesn't unmount when hidden.
 */
function CachedIframeRenderer({
  iframe,
  isActive,
  isBackground
}: {
  iframe: CachedIframe
  isActive: boolean
  isBackground: boolean
}) {
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  // Only probe for sessions, not webapps
  const { isLoading, error } =
    iframe.type === 'session'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useUrlProbing(iframe.id)
      : { isLoading: false, error: null }

  // Note: useWorkbenchStatus could be used for HUD display in the future
  // Currently only used for session iframes to track status
  if (iframe.type === 'session') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWorkbenchStatus(iframe.id)
  }

  const handleLoad = useCallback(() => {
    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }, [])

  // Determine the URL to load
  const iframeSrc = useMemo(() => {
    if (iframe.type === 'session') {
      // For sessions, wait until loading is complete
      return isLoading ? 'about:blank' : iframe.url || 'about:blank'
    }
    // For webapps, load directly
    return iframe.url
  }, [iframe.type, iframe.url, isLoading])

  return (
    <>
      {/* Loading overlay for active session iframes */}
      {isActive && iframe.type === 'session' && isLoading && (
        <LoadingOverlay isLoading={isLoading} />
      )}

      {/* Error message */}
      {isActive && error && (
        <div className="fixed left-1/2 top-2/3 z-20 -translate-x-1/2 -translate-y-1/2 transform text-gray-400">
          {error.message}
        </div>
      )}

      <iframe
        title={iframe.name}
        src={iframeSrc}
        allow="autoplay; fullscreen; clipboard-write;"
        style={{
          width: '100vw',
          height: 'calc(100vh - 44px)',
          visibility: isActive || isBackground ? 'visible' : 'hidden',
          pointerEvents: isActive ? 'auto' : 'none',
          position: 'fixed',
          left: 0,
          top: 44, // Header height
          zIndex: isActive ? 20 : isBackground ? 5 : -1,
          opacity: isBackground && !isActive ? 0.15 : 1,
          filter: isBackground && !isActive ? 'blur(2px)' : 'none'
        }}
        className="bg-background"
        id={`iframe-${iframe.id}`}
        ref={iFrameRef}
        aria-label={iframe.name}
        aria-hidden={!isActive && !isBackground}
        onLoad={handleLoad}
        tabIndex={isActive ? 0 : -1}
      />
    </>
  )
}

/**
 * Renders all cached iframes, showing only the active one.
 * Iframes that are not active remain in the DOM but are hidden,
 * preserving their state (login, form data, etc.).
 *
 * Background mode: Shows iframe in background when in workspace context
 * or on app-store page.
 */
export default function IframeCacheRenderer() {
  const { cachedIframes, activeIframeId } = useIframeCache()
  const { workbenches } = useAppState()
  const pathname = usePathname()
  const [iframeEntries, setIframeEntries] = useState<[string, CachedIframe][]>(
    []
  )

  // Check if we're on a session or webapp page (full active mode)
  const isIframePage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    const webappPageRegex = /^\/webapps\/[^/]+$/
    return sessionPageRegex.test(pathname) || webappPageRegex.test(pathname)
  }, [pathname])

  // Extract workspace ID from current path
  const currentWorkspaceId = useMemo(() => {
    const match = pathname.match(/^\/workspaces\/([^/]+)/)
    return match ? match[1] : null
  }, [pathname])

  // Check if we're on app-store page
  const isAppStorePage = pathname === '/app-store'

  // Determine which iframe should be shown in background
  const backgroundIframeId = useMemo(() => {
    // If we're on an iframe page, no background needed (it's active)
    if (isIframePage) return null

    // If we're in a workspace or on app-store
    if (currentWorkspaceId || isAppStorePage) {
      // Find a loaded session from the current workspace (or any if on app-store)
      for (const [id, iframe] of cachedIframes.entries()) {
        if (iframe.type === 'session') {
          const workbench = workbenches?.find((wb) => wb.id === id)
          if (workbench) {
            // If on app-store, show any active session
            if (isAppStorePage && activeIframeId === id) {
              return id
            }
            // If in workspace, show session from this workspace
            if (currentWorkspaceId && workbench.workspaceId === currentWorkspaceId) {
              return id
            }
          }
        }
      }
    }

    return null
  }, [isIframePage, currentWorkspaceId, isAppStorePage, cachedIframes, workbenches, activeIframeId])

  // Update iframe entries when cache changes
  useEffect(() => {
    setIframeEntries(Array.from(cachedIframes.entries()))
  }, [cachedIframes])

  // Don't render anything if there are no cached iframes
  if (iframeEntries.length === 0) {
    return null
  }

  return (
    <>
      {iframeEntries.map(([id, iframe]) => (
        <CachedIframeRenderer
          key={id}
          iframe={iframe}
          isActive={isIframePage && activeIframeId === id}
          isBackground={backgroundIframeId === id}
        />
      ))}
    </>
  )
}
