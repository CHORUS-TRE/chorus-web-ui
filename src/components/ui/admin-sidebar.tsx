'use client'

import { LayoutDashboard, Shield, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { ElementType } from 'react'

import { Link } from '@/components/link'
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
    { href: '/admin/roles', label: 'Roles', icon: Shield }
    // { href: '/admin/workspaces', label: 'Workspaces', icon: Box }
    // Removed placeholder links to prevent navigation confusion
    // TODO: Implement Teams, Sessions, Apps pages when ready
  ]

  return (
    <Sidebar className="relative">
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
