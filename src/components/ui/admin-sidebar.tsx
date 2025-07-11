'use client'

import { Box, Database, LayoutDashboard, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ElementType } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface AdminRoute {
  href: string
  label: string
  icon: ElementType
}

export function AdminSidebar() {
  const pathname = usePathname()

  const routes: AdminRoute[] = [
    { href: '/admin', label: 'General', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '#', label: 'Teams', icon: Users },
    { href: '/admin/roles', label: 'Roles', icon: Shield },
    { href: '#', label: 'Data', icon: Database },
    { href: '/admin/workspaces', label: 'Workspaces', icon: Box },
    { href: '#', label: 'Sessions', icon: Box },
    { href: '#', label: 'Apps', icon: Box }
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.label} className="text-white">
                  <SidebarMenuButton asChild disabled={route.href === '#'}>
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 text-muted hover:text-accent',
                        pathname === route.href && 'text-accent',
                        route.href === '#' && 'cursor-not-allowed'
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
