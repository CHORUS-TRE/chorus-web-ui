'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useUrlProbing } from '@/components/hooks/use-url-probing'
import { CachedIframe } from '@/domain/model'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'

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
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)
  // Track which URLs have successfully loaded to handle switching between cached iframes
  const loadedUrlsRef = useRef<Set<string>>(new Set())
  const { isFullscreen } = useFullscreenContext()
  const contentRect = useAppState((state) => state.contentRect)
  const immersiveUIVisible = useAppState((state) => state.immersiveUIVisible)

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

  // Determine the URL to load
  const iframeSrc = useMemo(() => {
    if (iframe.type === 'session') {
      // For sessions, wait until URL probing is complete
      return isLoading ? 'about:blank' : iframe.url || 'about:blank'
    }
    // For webapps, load directly
    return iframe.url
  }, [iframe.type, iframe.url, isLoading])

  // Reset loaded state when URL changes to a new URL
  useEffect(() => {
    if (iframe.url && iframe.url !== 'about:blank') {
      // Check if this URL has been loaded before
      if (loadedUrlsRef.current.has(iframe.url)) {
        // This URL was previously loaded, mark as loaded immediately
        setIsIframeLoaded(true)
      } else {
        // New URL, wait for it to load
        setIsIframeLoaded(false)
      }
    } else {
      setIsIframeLoaded(false)
    }
  }, [iframe.url])

  const handleLoad = useCallback(() => {
    // Only mark as loaded if the iframe is actually showing content (not about:blank)
    if (
      iFrameRef.current?.src &&
      !iFrameRef.current.src.includes('about:blank')
    ) {
      const loadedUrl = iFrameRef.current.src
      // Add this URL to the set of successfully loaded URLs
      loadedUrlsRef.current.add(loadedUrl)
      setIsIframeLoaded(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }, [])

  // Show loading overlay if:
  // 1. Iframe is active
  // 2. Not already loaded
  // 3. Either showing about:blank OR still probing (for sessions) OR has a URL to load
  const isShowingAboutBlank = iframeSrc === 'about:blank' || !iframeSrc
  const hasUrlToLoad = iframe.url && iframe.url !== 'about:blank'
  const showLoadingOverlay =
    isActive &&
    !isIframeLoaded &&
    (isShowingAboutBlank ||
      (iframe.type === 'session' && isLoading) ||
      (hasUrlToLoad && !isIframeLoaded))

  return (
    <>
      {/* Loading overlay for active iframes until they're fully loaded */}
      {showLoadingOverlay && (
        <LoadingOverlay isLoading={true} variant="container" />
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
          width:
            !isFullscreen && contentRect ? `${contentRect.width}px` : '100vw',
          height:
            !isFullscreen && contentRect
              ? `${contentRect.height}px`
              : isFullscreen
                ? '100vh'
                : 'calc(100vh - 44px)',
          visibility: showLoadingOverlay
            ? 'hidden'
            : isActive || isBackground
              ? 'visible'
              : 'hidden',
          pointerEvents: isActive && !showLoadingOverlay ? 'auto' : 'none',
          position: 'fixed' as const,
          left: !isFullscreen && contentRect ? `${contentRect.left}px` : 0,
          top:
            !isFullscreen && contentRect
              ? `${contentRect.top}px`
              : isFullscreen
                ? 0
                : 44,
          zIndex: isActive ? 30 : isBackground ? 5 : -1,
          opacity: showLoadingOverlay
            ? 0
            : isBackground && !isActive
              ? 0.15
              : 1,
          filter: isBackground && !isActive ? 'blur(2px)' : 'none',
          borderRadius: !isFullscreen && contentRect ? '16px' : '0px',
          overflow: 'hidden'
        }}
        className="bg-background transition-all duration-500 ease-in-out"
        id={`iframe-${iframe.id}`}
        ref={iFrameRef}
        aria-label={iframe.name}
        aria-hidden={showLoadingOverlay || (!isActive && !isBackground)}
        onLoad={handleLoad}
        tabIndex={isActive && !showLoadingOverlay ? 0 : -1}
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
 *
 * Fullscreen mode: Shows active iframe in fullscreen when fullscreen is enabled
 */
export default function IframeCacheRenderer() {
  const { cachedIframes, activeIframeId } = useIframeCache()
  const { workbenches } = useAppState()
  const pathname = usePathname()
  const { isFullscreen } = useFullscreenContext()
  const [iframeEntries, setIframeEntries] = useState<[string, CachedIframe][]>(
    []
  )

  // Check if we're on a session or webapp page (full active mode)
  const isIframePage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    const webappPageRegex = /^\/sessions\/[^/]+$/
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
            if (
              currentWorkspaceId &&
              workbench.workspaceId === currentWorkspaceId
            ) {
              return id
            }
          }
        }
      }
    }

    return null
  }, [
    isIframePage,
    currentWorkspaceId,
    isAppStorePage,
    cachedIframes,
    workbenches,
    activeIframeId
  ])

  // Update iframe entries when cache changes
  useEffect(() => {
    setIframeEntries(Array.from(cachedIframes.entries()))
  }, [cachedIframes])

  // Don't render anything if there are no cached iframes
  if (iframeEntries.length === 0) {
    return null
  }

  // Always render fixed-position iframes (Immersive Mode is now default for sessions)
  // 1. In fullscreen mode
  // 2. In background mode (workspace/app-store)
  // 3. On webapp pages
  // 4. On session pages (NOW ADDED)

  // We effectively always want the cache renderer to handle the iframes now for consistency
  // and to support the immersive "under-UI" layout.

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
