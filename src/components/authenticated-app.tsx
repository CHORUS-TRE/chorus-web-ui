'use client'

import { CircleGauge, PanelLeftOpen } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React from 'react'

import { Header } from '@/components/header'
import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/button'
import GettingStartedCard from '~/components/getting-started-card'
import { LeftSidebar, navItems } from '~/components/left-sidebar'
import RightSidebar from '~/components/right-sidebar'
import { steps } from '~/lib/tours'

interface MainLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  const { background, showRightSidebar } = useAppState()
  const router = useRouter()
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
    return item?.label || 'Dashboard'
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

          {background?.sessionId && (
            <Link
              href={`/workspaces/${background.workspaceId}/sessions/${background?.sessionId}`}
              passHref
            >
              <div
                className="fixed left-0 top-11 z-30 h-full w-full cursor-pointer bg-slate-700 bg-opacity-70 text-muted transition-all duration-300 hover:bg-opacity-10 hover:text-accent"
                id="iframe-overlay "
              />
            </Link>
          )}

          {/* Layout container with flexbox - sidebar and content side by side */}
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
                  'mr-2 h-[calc(100vh-2.75rem-1rem-16px)] w-[240px] flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
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

              {/* Content container */}
              <div
                className={cn(
                  'flex h-full items-start',
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
                  className="b1 glass-surface relative flex h-full w-full flex-col overflow-hidden rounded-2xl"
                >
                  <div className="glass-surface sticky top-0 z-[100] flex items-center gap-4 rounded-t-2xl border-b border-muted/50 p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                      className="h-8 w-8"
                    >
                      <PanelLeftOpen
                        className={`h-4 w-4 transition-transform duration-300 ${leftSidebarOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>
                    <h1 className="flex items-center gap-2 text-lg font-semibold">
                      <CircleGauge className="h-4 w-4" />
                      {pageTitle}
                    </h1>
                  </div>

                  <div className="flex-1 overflow-auto px-8 py-4">
                    {children}
                  </div>
                </div>

                {/* Right Sidebar - temporarily hidden */}
                <div
                  className="glass-surface hidden h-full overflow-hidden rounded-2xl p-4"
                  id="right-sidebar"
                >
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </NextStep>
      </NextStepProvider>
    </>
  )
}
