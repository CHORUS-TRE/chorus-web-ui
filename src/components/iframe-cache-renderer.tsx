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
import { useSidebar } from '@/hooks/use-sidebar'
import { useUserPreferences } from '@/stores/user-preferences-store'

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
      // Check if this is a new URL (iframe was not already showing this URL)
      if (iFrameRef.current?.src !== iframe.url) {
        setIsIframeLoaded(false)
      }
    } else {
      setIsIframeLoaded(false)
    }
  }, [iframe.url])

  // When iframe becomes active, check if it's already loaded (already showing the correct URL)
  useEffect(() => {
    if (
      isActive &&
      iFrameRef.current &&
      iframe.url &&
      iframe.url !== 'about:blank'
    ) {
      const currentSrc = iFrameRef.current.src
      // If iframe is already showing the correct URL, mark it as loaded
      // This handles the case where we switch to an already-loaded iframe
      if (
        currentSrc &&
        currentSrc !== 'about:blank' &&
        currentSrc === iframe.url
      ) {
        setIsIframeLoaded(true)
      }
      // Don't set to false here - let the URL change effect handle that
      // This way, new loads will show the loading overlay
    }
  }, [isActive, iframe.url])

  const handleLoad = useCallback(() => {
    // Only mark as loaded if the iframe is actually showing content (not about:blank)
    if (
      iFrameRef.current?.src &&
      !iFrameRef.current.src.includes('about:blank')
    ) {
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
      {showLoadingOverlay && <LoadingOverlay isLoading={true} />}

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
          visibility: showLoadingOverlay
            ? 'hidden'
            : isActive || isBackground
              ? 'visible'
              : 'hidden',
          pointerEvents: isActive && !showLoadingOverlay ? 'auto' : 'none',
          position: 'fixed',
          left: 0,
          top: 44, // Header height
          zIndex: isActive ? 20 : isBackground ? 5 : -1,
          opacity: showLoadingOverlay
            ? 0
            : isBackground && !isActive
              ? 0.15
              : 1,
          filter: isBackground && !isActive ? 'blur(2px)' : 'none'
        }}
        className="bg-background"
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
  const { workbenches, immersiveUIVisible } = useAppState()
  const pathname = usePathname()
  const { isFullscreen } = useFullscreenContext()
  const [iframeEntries, setIframeEntries] = useState<[string, CachedIframe][]>(
    []
  )
  const { isOpen: leftSidebarOpen } = useSidebar()
  const { showRightSidebar } = useUserPreferences()

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

      {/* SVG Mask Overlay - creates black overlay with hole for iframe content area */}
      {isIframePage && activeIframeId && !isFullscreen && immersiveUIVisible && (() => {
        // Calculate hole position based on layout
        // Values are in percentage of viewport
        const padding = 1.2 // ~16px / ~1300px viewport = ~1.2%
        const breadcrumbHeight = 5 // ~52px / ~900px available height = ~6%
        const bottomBar = 1 // ~8px / ~900px = ~1%
        const glassPillar = 0.8 // ~8px / ~1000px = ~0.8%

        // Left edge depends on sidebar: sidebar(240px) + padding(16px) + pillar(8px)
        // On 1400px viewport: (240+16+8)/1400 = ~19% when sidebar open
        // When closed: (16+8)/1400 = ~1.7%
        const leftEdge = leftSidebarOpen
          ? 20 + padding
          : padding + 0.5

        // Right edge depends on right sidebar
        // Width of hole = 100 - leftEdge - rightEdge
        const rightEdge = showRightSidebar
          ? 20 + padding // sidebar + padding
          : padding + 0.5

        const holeX = leftEdge + glassPillar
        const holeWidth = 100 - holeX - rightEdge - glassPillar
        const holeY = breadcrumbHeight
        const holeHeight = 100 - holeY - bottomBar - padding

        return (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'fixed',
              inset: 0,
              top: 44,
              width: '100%',
              height: 'calc(100vh - 44px)',
              zIndex: 25,
              pointerEvents: 'none'
            }}
          >
            <defs>
              <mask id="hole-mask">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <rect
                  x={holeX}
                  y={holeY}
                  width={holeWidth}
                  height={holeHeight}
                  rx="1"
                  ry="1"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="black"
              mask="url(#hole-mask)"
            />
          </svg>
        )
      })()}
    </>
  )
}
