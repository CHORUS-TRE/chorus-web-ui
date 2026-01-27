'use client'

import { PanelLeftOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Header } from '@/components/header'
import { cn } from '@/lib/utils'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import GettingStartedCard from '~/components/getting-started-card'
import { LeftSidebar } from '~/components/left-sidebar'
import RightSidebar from '~/components/right-sidebar'
import { AppBreadcrumb } from '~/components/ui/app-breadcrumb'
import { steps } from '~/lib/tours'

interface MainLayoutProps {
  children: React.ReactNode
}

function AuthenticatedAppContent({ children }: MainLayoutProps) {
  const { showRightSidebar } = useUserPreferences()
  const pathname = usePathname()
  const { isFullscreen } = useFullscreenContext()

  const isIFramePage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    const webappPageRegex = /^\/webapps\/[^/]+$/
    return sessionPageRegex.test(pathname) || webappPageRegex.test(pathname)
  }, [pathname])

  // Immersive Mode Logic
  const immersiveUIVisible = useAppState((state) => state.immersiveUIVisible)
  const setImmersiveUIVisible = useAppState(
    (state) => state.setImmersiveUIVisible
  )
  const immersiveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Ref for content-main element to measure its position
  const contentMainRef = useRef<HTMLDivElement>(null)
  const [contentRect, setContentRect] = useState<DOMRect | null>(null)

  // Update content rect on resize
  const updateContentRect = useCallback(() => {
    if (contentMainRef.current) {
      setContentRect(contentMainRef.current.getBoundingClientRect())
    }
  }, [])

  // ResizeObserver to track content-main element size and position
  useEffect(() => {
    const element = contentMainRef.current
    if (!element) return

    // Initial measurement
    updateContentRect()

    // Observe resize
    const resizeObserver = new ResizeObserver(() => {
      updateContentRect()
    })
    resizeObserver.observe(element)

    // Also listen to window resize for position changes
    window.addEventListener('resize', updateContentRect)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContentRect)
    }
  }, [updateContentRect])

  // Reset visibility when not on a session page
  useEffect(() => {
    if (!isIFramePage) {
      setImmersiveUIVisible(true)
      if (immersiveTimeoutRef.current) {
        clearTimeout(immersiveTimeoutRef.current)
      }
    }

    return () => {
      if (immersiveTimeoutRef.current) clearTimeout(immersiveTimeoutRef.current)
    }
  }, [isIFramePage, pathname, setImmersiveUIVisible]) // Re-run when page changes

  const handleHeaderHover = () => {
    // Show UI when hovering header
    if (isIFramePage) {
      setImmersiveUIVisible(true)
    }
  }

  const handleContentMainHover = () => {
    // Show UI when hovering content-main
    if (isIFramePage) {
      setImmersiveUIVisible(false)
    }
  }

  // Handle closing the immersive UI manually (if we add a button later inside the UI)
  const toggleImmersiveUI = () => {
    setImmersiveUIVisible(!immersiveUIVisible)
  }

  return (
    <div id="authenticated-app">
      <NextStepProvider>
        <NextStep
          steps={steps}
          showNextStep={false}
          displayArrow={true}
          clickThroughOverlay={true}
          cardComponent={GettingStartedCard}
        >
          <div
            className="fixed left-0 top-0 z-40 h-11 min-w-full"
            onMouseEnter={handleHeaderHover}
          >
            <Header />
          </div>

          {/* Main Layout Container - Fades out in Immersive Mode */}
          <div
            className={cn(
              'fixed inset-0 top-12 z-30 p-4 transition-opacity duration-500 ease-in-out',
              isIFramePage && !immersiveUIVisible
                ? 'pointer-events-none opacity-0'
                : 'opacity-100'
            )}
          >
            <div
              className={cn(
                'flex h-full w-full',
                'flex-row',
                // Desktop: center content if sidebar closed, otherwise align to left
                !isFullscreen
                  ? 'xl:justify-start 2xl:justify-start'
                  : 'xl:justify-center 2xl:justify-center'
              )}
            >
              {/* Left Sidebar - in flex flow - hidden in fullscreen */}
              <div
                className={cn(
                  'mr-2 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] flex-shrink-0 overflow-hidden transition-all duration-300',
                  !isFullscreen ? 'block opacity-100' : 'hidden opacity-0'
                )}
              >
                <LeftSidebar />
              </div>

              {/* Content container */}
              <div
                className={cn(
                  'flex h-full items-start gap-2',
                  // Mobile: content takes full width
                  'w-full',
                  // In fullscreen mode, take full width
                  isFullscreen ? 'w-full' : 'xl:w-[80vw] 2xl:w-[80vw]'
                )}
              >
                {/* Main Content */}
                <div
                  id="content"
                  className={cn(
                    'relative flex h-full flex-col overflow-hidden rounded-2xl border border-muted/40',
                    // Background is handled by children or specific pages now
                    showRightSidebar && !isFullscreen
                      ? 'min-w-0 flex-1'
                      : 'w-full'
                  )}
                >
                  {/* Breadcrumb - above all content */}
                  <div className="border-b border-muted/20 bg-contrast-background/50 px-8 py-3 backdrop-blur-md">
                    <AppBreadcrumb />
                  </div>

                  <div
                    id="content-main"
                    onMouseEnter={handleContentMainHover}
                    ref={contentMainRef}
                    className={cn(
                      'flex-1 overflow-auto',
                      !isIFramePage &&
                        'bg-contrast-background/50 px-8 py-4 backdrop-blur-md'
                    )}
                  >
                    {children}
                  </div>
                </div>

                {/* Right Sidebar - hidden in fullscreen */}
                <div
                  className={cn(
                    'h-full overflow-hidden rounded-2xl border border-muted/40 bg-contrast-background/50 backdrop-blur-md transition-all duration-300 ease-in-out',
                    showRightSidebar && !isFullscreen
                      ? 'w-[240px] flex-shrink-0'
                      : 'hidden'
                  )}
                  id="right-sidebar"
                >
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>

          {/* SVG Mask Overlay - creates overlay with hole for iframe content area */}
          {isIFramePage &&
            !isFullscreen &&
            immersiveUIVisible &&
            contentRect && (
              <svg
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 25,
                  pointerEvents: 'none'
                }}
              >
                <defs>
                  <mask id="hole-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <rect
                      x={contentRect.left + 32}
                      y={contentRect.top}
                      width={contentRect.width - 64}
                      height={contentRect.height - 32}
                      rx="16"
                      ry="16"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="hsl(var(--background))"
                  mask="url(#hole-mask)"
                />
              </svg>
            )}
        </NextStep>
      </NextStepProvider>
    </div>
  )
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  return <AuthenticatedAppContent>{children}</AuthenticatedAppContent>
}
