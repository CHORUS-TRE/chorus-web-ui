'use client'

import { PanelLeftOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React, { useMemo } from 'react'

import { Header } from '@/components/header'
import { useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
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

  // Keyboard shortcut: Ctrl+B to toggle sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setLeftSidebarOpen((prev: boolean) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setLeftSidebarOpen])

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
          <div className="fixed left-0 top-0 z-40 h-11 min-w-full">
            <Header />
          </div>

          {/* Invisible hover zone on left edge to reveal sidebar */}
          {!leftSidebarOpen && !isFullscreen && (
            <div
              className="fixed left-0 top-11 z-50 h-[calc(100vh-2.75rem)] w-4 cursor-pointer"
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              aria-hidden="true"
            />
          )}

          <>
            {/* Normal layout container with flexbox - sidebar and content side by side */}
            <div className="fixed inset-0 top-12 z-30 p-4">
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
                      'relative flex h-full flex-col overflow-hidden rounded-2xl border border-muted/40 bg-contrast-background/50 backdrop-blur-md',
                      // Adjust width when right sidebar is visible
                      showRightSidebar && !isFullscreen
                        ? 'min-w-0 flex-1'
                        : 'w-full'
                    )}
                  >
                    {/* Breadcrumb - above all content */}
                    <div className="border-b border-muted/20 px-8 py-3">
                      <AppBreadcrumb />
                    </div>

                    <div className="flex-1 overflow-auto px-8 py-4">
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
            {!leftSidebarOpen && leftSidebarHovered && !isFullscreen && (
              <div
                className="fixed left-4 top-28 z-50 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] duration-200 animate-in slide-in-from-left"
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
              >
                <LeftSidebar
                  isOpen={false}
                  setIsOpen={() => {}}
                  isHovered={true}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              </div>
            )}
          </>
        </NextStep>
      </NextStepProvider>
    </div>
  )
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  return <AuthenticatedAppContent>{children}</AuthenticatedAppContent>
}
