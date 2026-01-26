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
  const { isOpen: leftSidebarOpen, setOpen: setLeftSidebarOpen } = useSidebar()
  const { showRightSidebar } = useUserPreferences()
  const pathname = usePathname()
  const { isFullscreen } = useFullscreenContext()

  const [leftSidebarHovered, setLeftSidebarHovered] = React.useState(false)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const isIFramePage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    const webappPageRegex = /^\/webapps\/[^/]+$/
    return sessionPageRegex.test(pathname) || webappPageRegex.test(pathname)
  }, [pathname])

  const handleHoverStart = () => {
    if (!leftSidebarOpen) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      setLeftSidebarHovered(true)
    }
  }

  const handleHoverEnd = () => {
    if (!leftSidebarOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setLeftSidebarHovered(false)
      }, 200)
    }
  }


  // Immersive Mode Logic
  const immersiveUIVisible = useAppState((state) => state.immersiveUIVisible)
  const setImmersiveUIVisible = useAppState((state) => state.setImmersiveUIVisible)
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
                <LeftSidebar
                  isOpen={leftSidebarOpen}
                  setIsOpen={setLeftSidebarOpen}
                  isHovered={false}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
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

          {/* Hover sidebar overlay - appears when sidebar is closed and hovered (same position as regular sidebar) */}
          {!leftSidebarOpen &&
            leftSidebarHovered &&
            !isFullscreen &&
            !immersiveUIVisible && (
              <div
                className="fixed left-4 top-28 z-50 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] duration-200 animate-in slide-in-from-left"
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
              >
                <LeftSidebar
                  isOpen={false}
                  setIsOpen={() => { }}
                  isHovered={true}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              </div>
            )}
        </NextStep>
      </NextStepProvider>
    </div>
  )
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  return <AuthenticatedAppContent>{children}</AuthenticatedAppContent>
}
