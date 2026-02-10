'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Header } from '@/components/header'
import { isSessionPath } from '@/lib/route-utils'
import { cn } from '@/lib/utils'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import GettingStartedCard from '~/components/getting-started-card'
import { LeftSidebar } from '~/components/left-sidebar'
import RightSidebar from '~/components/right-sidebar'
import { steps } from '~/lib/tours'

interface MainLayoutProps {
  children: React.ReactNode
}

function AuthenticatedAppContent({ children }: MainLayoutProps) {
  const { showRightSidebar, showLeftSidebar } = useUserPreferences()
  const pathname = usePathname()
  const { isFullscreen } = useFullscreenContext()

  const isSessionPage = useMemo(() => isSessionPath(pathname), [pathname])

  // Left sidebar visibility for immersive mode (edge hover)
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false)
  const leftHideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ref for content-main element to measure its position
  const contentMainRef = useRef<HTMLDivElement>(null)
  const setContentRect = useAppState((state) => state.setContentRect)

  // Update content rect on resize
  const updateContentRect = useCallback(() => {
    if (contentMainRef.current) {
      setContentRect(contentMainRef.current.getBoundingClientRect())
    }
  }, [setContentRect])

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

  // Reset left sidebar visibility when leaving iframe page
  useEffect(() => {
    if (!isSessionPage) {
      setLeftSidebarVisible(false)
      if (leftHideTimeoutRef.current) clearTimeout(leftHideTimeoutRef.current)
    }

    return () => {
      if (leftHideTimeoutRef.current) clearTimeout(leftHideTimeoutRef.current)
    }
  }, [isSessionPage, pathname])

  // On first arrival to session page, briefly show the left sidebar then hide
  useEffect(() => {
    if (isSessionPage) {
      setLeftSidebarVisible(true)
      leftHideTimeoutRef.current = setTimeout(() => {
        setLeftSidebarVisible(false)
      }, 2000)
    }
  }, [])

  // Left sidebar controls (edge hover)
  const showLeftSidebarHandler = useCallback(() => {
    if (leftHideTimeoutRef.current) {
      clearTimeout(leftHideTimeoutRef.current)
      leftHideTimeoutRef.current = null
    }
    setLeftSidebarVisible(true)
  }, [])

  const hideLeftSidebarHandler = useCallback(() => {
    if (!isSessionPage) return
    if (leftHideTimeoutRef.current) clearTimeout(leftHideTimeoutRef.current)
    leftHideTimeoutRef.current = setTimeout(() => {
      setLeftSidebarVisible(false)
    }, 100) // 100ms delay before hiding
  }, [isSessionPage])

  // Right sidebar resizing
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth >= 200 && newWidth <= 800) {
          setRightSidebarWidth(newWidth)
        }
      }
    },
    [isResizing]
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    } else {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return (
    <div
      id="authenticated-app"
      className={cn(isResizing && 'cursor-col-resize select-none')}
    >
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

          {/* Left edge trigger zone - shows left sidebar when hovered */}
          {isSessionPage && !isFullscreen && (
            <div
              className="fixed left-0 top-11 z-30 flex h-[calc(100vh-44px)] items-center justify-center text-muted-foreground/50 transition-colors hover:text-muted-foreground"
              style={{ width: 15 }}
              onMouseEnter={showLeftSidebarHandler}
            >
              <ChevronRight className="h-5 w-5" />
            </div>
          )}

          {/* Fixed sidebars for iframe pages - positioned at screen edges */}
          {isSessionPage && !isFullscreen && (
            <>
              {/* Left Sidebar - fixed at left edge, controlled by edge hover */}
              <div
                className={cn(
                  'fixed left-3 top-16 z-40 h-[calc(100vh-5rem)] w-[240px] overflow-hidden transition-transform duration-300 ease-in-out',
                  leftSidebarVisible && showLeftSidebar
                    ? 'translate-x-0'
                    : 'pointer-events-none -translate-x-[calc(100%+12px)]'
                )}
                onMouseEnter={showLeftSidebarHandler}
                onMouseLeave={hideLeftSidebarHandler}
              >
                <LeftSidebar />
              </div>

              {/* Right Sidebar - fixed at right edge, controlled by header button only */}
              <div
                className={cn(
                  'fixed right-4 top-16 z-30 h-[calc(100vh-5rem)] overflow-visible rounded-2xl border border-muted/40 bg-contrast-background/50 backdrop-blur-md transition-all duration-300 ease-in-out',
                  showRightSidebar
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none translate-x-full opacity-0',
                  isResizing && 'duration-0'
                )}
                style={{ width: showRightSidebar ? rightSidebarWidth : 0 }}
                id="right-sidebar-immersive"
              >
                {/* Resize Handle */}
                {showRightSidebar && (
                  <div
                    className="absolute left-0 top-0 z-50 h-full w-1 cursor-col-resize transition-colors hover:bg-primary/50 active:bg-primary"
                    onMouseDown={startResizing}
                  />
                )}
                <div className="h-full w-full overflow-hidden">
                  <RightSidebar />
                </div>
              </div>
            </>
          )}

          {/* Main Layout Container - only for non-iframe pages */}
          {!isSessionPage && (
            <div className="fixed inset-0 top-12 z-30 p-4 transition-all duration-300 ease-in-out">
              <div
                className={cn(
                  'flex h-full w-full',
                  'flex-row',
                  !isFullscreen
                    ? 'xl:justify-start 2xl:justify-start'
                    : 'xl:justify-center 2xl:justify-center'
                )}
              >
                {/* Left Sidebar */}
                <div
                  className={cn(
                    'h-[calc(100vh-2.75rem-1rem-16px)] flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
                    !isFullscreen && showLeftSidebar
                      ? 'mr-2 w-[240px] translate-x-0 opacity-100'
                      : 'mr-0 w-0 -translate-x-full opacity-0'
                  )}
                >
                  <LeftSidebar />
                </div>

                {/* Content container */}
                <div
                  className={cn(
                    'flex h-full items-start gap-2',
                    'w-full',
                    isFullscreen ? 'w-full' : 'xl:w-[80vw] 2xl:w-[80vw]'
                  )}
                >
                  {/* Main Content */}
                  <div
                    id="content"
                    className={cn(
                      'relative flex h-full flex-col overflow-hidden rounded-2xl border border-muted/40',
                      showRightSidebar && !isFullscreen
                        ? 'min-w-0 flex-1'
                        : 'w-full'
                    )}
                  >
                    <div
                      id="content-main"
                      ref={contentMainRef}
                      className="flex-1 overflow-auto bg-contrast-background/50 px-8 py-4 backdrop-blur-md"
                    >
                      {children}
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div
                    className={cn(
                      'relative h-full overflow-visible rounded-2xl border border-muted/40 bg-contrast-background/50 backdrop-blur-md transition-all duration-300 ease-in-out',
                      !isFullscreen && showRightSidebar
                        ? 'flex-shrink-0 translate-x-0 opacity-100'
                        : 'w-0 translate-x-full opacity-0',
                      isResizing && 'duration-0'
                    )}
                    style={{
                      width:
                        !isFullscreen && showRightSidebar
                          ? rightSidebarWidth
                          : 0
                    }}
                    id="right-sidebar"
                  >
                    {/* Resize Handle */}
                    {showRightSidebar && !isFullscreen && (
                      <div
                        className="absolute left-0 top-0 z-50 h-full w-1 cursor-col-resize transition-colors hover:bg-primary/50 active:bg-primary"
                        onMouseDown={startResizing}
                      />
                    )}
                    <div className="h-full w-full overflow-hidden">
                      <RightSidebar />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content area for iframe pages */}
          {isSessionPage && (
            <div
              id="content-main"
              ref={contentMainRef}
              className="pointer-events-none fixed inset-0 top-12 z-30"
            >
              {children}
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
