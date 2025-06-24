'use client'

import { Box, LayoutDashboard, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ElementType } from 'react'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AdminRoute {
  href: string
  label: string
  icon: ElementType
}

export function AdminSidebar() {
  const pathname = usePathname()

  const routes: AdminRoute[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/roles', label: 'Roles', icon: Shield },
    { href: '/admin/workspaces', label: 'Workspaces', icon: Box }
  ]

  return (
    <aside className="h-screen w-[300px] flex-shrink-0 bg-background/40 p-6 text-white">
      <h2 className="mb-8 pl-2 text-xl font-semibold text-white">
        Chorus Management
      </h2>
      <div className="flex flex-col gap-4">
        {routes.map((route) => {
          // Handle active state for parent routes
          const isActive =
            route.href === '/admin'
              ? pathname === route.href
              : pathname.startsWith(route.href)

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex cursor-pointer items-center gap-2 text-accent hover:text-accent hover:underline',
                isActive && 'border-accent bg-background/80 shadow-lg'
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
