'use client'

import { PanelLeftOpen } from 'lucide-react'
import React from 'react'

import { AppBreadcrumb } from '@/components/ui/app-breadcrumb'
import { cn } from '@/lib/utils'
import { Kbd, KbdGroup } from '~/components/ui/kbd'

import { Button } from './button'

interface AppHeaderBarProps {
  leftSidebarOpen: boolean
  setLeftSidebarOpen: (open: boolean) => void
  leftSidebarHovered: boolean
  handleHoverStart: () => void
  handleHoverEnd: () => void
  className?: string
}

export function AppHeaderBar({
  leftSidebarOpen,
  setLeftSidebarOpen,
  leftSidebarHovered,
  handleHoverStart,
  handleHoverEnd,
  className
}: AppHeaderBarProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-[100] flex h-11 items-center gap-4 border-b border-muted/50 bg-contrast-background/50 p-2 backdrop-blur-md',
        className
      )}
    >
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
          <span className="ml-2 text-xs text-muted-foreground">
            - to open the sidebar
          </span>
        </div>
      ) : (
        <div
          className={cn(
            'transition-all duration-300',
            leftSidebarOpen ? 'ml-2' : 'ml-0'
          )}
        >
          <AppBreadcrumb />
        </div>
      )}
    </div>
  )
}
