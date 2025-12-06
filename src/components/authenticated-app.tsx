'use client'

import { CircleGauge, PanelLeftOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React, { useMemo } from 'react'

import { Header } from '@/components/header'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import GettingStartedCard from '~/components/getting-started-card'
import { LeftSidebar, navItems } from '~/components/left-sidebar'
import RightSidebar from '~/components/right-sidebar'
import { Kbd, KbdGroup } from '~/components/ui/kbd'
import { steps } from '~/lib/tours'

interface MainLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  const { showRightSidebar } = useUserPreferences()
  const pathname = usePathname()

  // Persist sidebar state in localStorage
  const [leftSidebarOpen, setLeftSidebarOpen] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('leftSidebarOpen')
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  const [leftSidebarHovered, setLeftSidebarHovered] = React.useState(false)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('leftSidebarOpen', JSON.stringify(leftSidebarOpen))
  }, [leftSidebarOpen])

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

  const pageTitle = React.useMemo(() => {
    const item = navItems.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    )
    return item?.label || ''
  }, [pathname])

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
  }, [])

  return (
    <>
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
          {!leftSidebarOpen && (
            <div
              className="fixed left-0 top-11 z-50 h-[calc(100vh-2.75rem)] w-4 cursor-pointer"
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              aria-hidden="true"
            />
          )}

          {/* {background?.sessionId && (
            <Link
              href={`/workspaces/${background.workspaceId}/sessions/${background?.sessionId}`}
              passHref
            >
              <div
                className="fixed left-0 top-11 z-30 h-full w-full cursor-pointer bg-slate-700 bg-opacity-70 text-muted transition-all duration-300 hover:bg-opacity-10 hover:text-accent"
                id="iframe-overlay "
              />
            </Link>
          )} */}

          {/* Session page layout - full screen with sidebar overlay */}
          {isIFramePage ? (
            <>
              {/* Content takes full screen */}
              <div className="fixed inset-0 top-11 z-20 bg-black/50">
                {children}
              </div>

              {/* Left Sidebar - overlay on top */}
              <div
                className={cn(
                  'fixed left-4 top-16 z-50 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] overflow-hidden transition-all duration-300 ease-in-out',
                  leftSidebarOpen ? 'block' : 'hidden'
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

              {/* Sidebar toggle button - fixed position, only visible when sidebar is closed */}
              {!leftSidebarOpen && (
                <div className="fixed left-4 top-14 z-50">
                  <div
                    className="relative"
                    onMouseEnter={handleHoverStart}
                    onMouseLeave={handleHoverEnd}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLeftSidebarOpen(true)}
                      className="h-8 w-8 bg-background/80 text-accent backdrop-blur-sm hover:text-accent/80"
                    >
                      <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Hover sidebar overlay - appears when sidebar is closed and hovered (same position as regular sidebar) */}
              {!leftSidebarOpen && leftSidebarHovered && (
                <div
                  className="fixed left-4 top-24 z-50 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] duration-200 animate-in slide-in-from-left"
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
          ) : (
            <>
              {/* Normal layout container with flexbox - sidebar and content side by side */}
              <div className="fixed inset-0 top-12 z-30 p-4">
                <div
                  className={cn(
                    'flex h-full w-full',
                    'flex-row',
                    // Desktop: center content if sidebar closed, otherwise align to left
                    leftSidebarOpen
                      ? 'xl:justify-start 2xl:justify-start'
                      : 'xl:justify-center 2xl:justify-center'
                  )}
                >
                  {/* Left Sidebar - in flex flow */}
                  <div
                    className={cn(
                      'mr-2 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] flex-shrink-0 overflow-hidden',
                      leftSidebarOpen ? 'block' : 'hidden' // TODO: delay the sidebar hiding
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
                      // Desktop (>= xl): logic based on sidebar state
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
                        showRightSidebar ? 'min-w-0 flex-1' : 'w-full'
                      )}
                    >
                      <div className="sticky top-0 z-[100] flex h-11 items-center gap-4 border-b border-muted/50 bg-contrast-background/50 p-2 backdrop-blur-md">
                        {/* Toggle button only visible when sidebar is closed */}
                        {!leftSidebarOpen && (
                          <div
                            className="relative"
                            onMouseEnter={handleHoverStart}
                            onMouseLeave={handleHoverEnd}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLeftSidebarOpen(true)}
                              className="h-8 w-8 text-accent hover:text-accent/80"
                            >
                              <PanelLeftOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {!leftSidebarOpen && leftSidebarHovered ? (
                          <div className="relative">
                            <KbdGroup>
                              <Kbd>⌘</Kbd>
                              <span>+</span>
                              <Kbd>B</Kbd>
                            </KbdGroup>
                            <span className="text-xs text-muted-foreground">
                              {' '}
                              - to open the sidebar
                            </span>
                          </div>
                        ) : (
                          <h1
                            className={`flex items-center gap-2 text-lg font-semibold ${leftSidebarOpen ? 'ml-2' : 'ml-0'}`}
                          >
                            <CircleGauge className="h-4 w-4" />
                            {pageTitle}
                          </h1>
                        )}
                      </div>

                      <div className="flex-1 overflow-auto px-8 py-4">
                        {children}
                      </div>
                    </div>

                    {/* Right Sidebar */}
                    <div
                      className={cn(
                        'h-full overflow-hidden rounded-2xl border border-muted/40 bg-contrast-background/50 backdrop-blur-md transition-all duration-300 ease-in-out',
                        showRightSidebar ? 'w-[240px] flex-shrink-0' : 'hidden'
                      )}
                      id="right-sidebar"
                    >
                      <RightSidebar />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover sidebar overlay - appears when sidebar is closed and hovered (same position as regular sidebar) */}
              {!leftSidebarOpen && leftSidebarHovered && (
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
          )}
        </NextStep>
      </NextStepProvider>
    </>
  )
}
