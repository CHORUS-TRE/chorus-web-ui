'use client'

import {
  Database,
  GaugeCircle,
  HelpCircle,
  Home,
  LaptopMinimal,
  Package,
  Settings,
  Store
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { useAppState } from '~/providers/app-state-provider'

interface LeftSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isHovered: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

export const navItems = [
  {
    label: 'Dashboard',
    icon: GaugeCircle,
    href: '/',
    exact: true
  },
  {
    label: 'My Workspace',
    icon: Home,
    href: '/workspaces'
  },
  {
    label: 'Workspaces',
    icon: Package,
    href: '/workspaces'
  },
  {
    label: 'Sessions',
    icon: LaptopMinimal,
    href: '#' // Note: This route might need adjustment based on actual routing
  },
  {
    label: 'Data',
    icon: Database,
    href: '/data'
  },
  {
    label: 'App Store',
    icon: Store,
    href: '/app-store'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin'
  },
  {
    label: 'Session 234',
    icon: Settings,
    href: '/workspaces/195/sessions/234'
  },
  {
    label: 'Help',
    icon: HelpCircle,
    href: '#'
  }
]

export function LeftSidebar({
  isOpen,
  setIsOpen,
  isHovered,
  onHoverStart,
  onHoverEnd
}: LeftSidebarProps) {
  const pathname = usePathname()
  const { showRightSidebar, toggleRightSidebar } = useAppState()
  return (
    <>
      {/* Floating sidebar when hovering and closed */}
      {!isOpen && isHovered && (
        <div
          className="fixed left-0 top-[110px] z-40 h-[calc(100vh-110px)] w-80 duration-300 animate-in slide-in-from-left"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          <div className="glass-surface flex h-full flex-col gap-2 rounded-r-2xl border border-muted/40 p-4 shadow-2xl">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    variant="underline"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                      isActive
                        ? 'bg-accent/20 text-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Regular sidebar when open - slides in/out */}
      <div
        className={cn(
          'glass-surface flex h-full flex-col gap-2 rounded-2xl border border-muted/40 p-4 transition-transform duration-300 ease-in-out',
          !isOpen && !isHovered ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                variant="underline"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
