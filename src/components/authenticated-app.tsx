'use client'

import { PanelLeftOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React, { useMemo } from 'react'

import { Header } from '@/components/header'
import { useSidebar } from '@/hooks/use-sidebar'
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
  const { isOpen: leftSidebarOpen } = useSidebar()
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

  // Reset visibility when not on a session page
  React.useEffect(() => {
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

            {/* Close Overlay Button (Only on Session Pages) */}
            {isIFramePage && immersiveUIVisible && (
              <div
                className="absolute right-[35%] top-2 z-50 flex duration-300 animate-in fade-in"
                title="Hide Sidebars"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-background/50 text-muted-foreground backdrop-blur hover:bg-background/80 hover:text-foreground"
                  onClick={() => setImmersiveUIVisible(false)}
                >
                  <PanelLeftOpen className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
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
                leftSidebarOpen && !isFullscreen
                  ? 'xl:justify-start 2xl:justify-start'
                  : 'xl:justify-center 2xl:justify-center'
              )}
            >
              {/* Left Sidebar - in flex flow - hidden in fullscreen */}
              <div
                className={cn(
                  'mr-2 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] flex-shrink-0 overflow-hidden transition-all duration-300',
                  leftSidebarOpen && !isFullscreen
                    ? 'block opacity-100'
                    : 'hidden opacity-0'
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
                  isFullscreen
                    ? 'w-full'
                    : // Desktop (>= xl): logic based on sidebar state
                      leftSidebarOpen
                      ? 'xl:min-w-[300px] xl:flex-1 2xl:w-[80vw] 2xl:flex-none'
                      : 'xl:w-[80vw] 2xl:w-[80vw]'
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

          {/* SVG Mask Overlay - creates black overlay with hole for iframe content area */}
          {isIFramePage &&
            !isFullscreen &&
            immersiveUIVisible &&
            (() => {
              // Calculate hole position based on layout
              // Values are in percentage of viewport
              const padding = 1.2 // ~16px / ~1300px viewport = ~1.2%
              const breadcrumbHeight = 5 // ~52px / ~900px available height = ~6%
              const bottomBar = 1 // ~8px / ~900px = ~1%
              const glassPillar = 0.8 // ~8px / ~1000px = ~0.8%

              // Left edge depends on sidebar: sidebar(240px) + padding(16px) + pillar(8px)
              // On 1400px viewport: (240+16+8)/1400 = ~19% when sidebar open
              // When closed: (16+8)/1400 = ~1.7%
              const leftEdge = leftSidebarOpen ? 20 + padding : padding + 0.5

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
        </NextStep>
      </NextStepProvider>
    </div>
  )
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  return <AuthenticatedAppContent>{children}</AuthenticatedAppContent>
}
