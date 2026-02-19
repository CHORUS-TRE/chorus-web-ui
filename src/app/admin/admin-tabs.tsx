'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useAuthorization } from '@/providers/authorization-provider'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

export function AdminTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const { can, PERMISSIONS } = useAuthorization()

  const routes = [
    {
      href: '/admin',
      label: 'Overview',
      authorized: true
    },
    {
      href: '/admin/users',
      label: 'Users',
      authorized: can(PERMISSIONS.listUsers, { user: '*' })
    },
    {
      href: '/admin/workspaces',
      label: 'Workspaces',
      authorized: can(PERMISSIONS.listWorkspaces, { workspace: '*' })
    },
    {
      href: '/admin/sessions',
      label: 'Sessions',
      authorized: can(PERMISSIONS.listWorkbenches, { workspace: '*' })
    },
    {
      href: '/admin/instances',
      label: 'App Instances',
      authorized: can(PERMISSIONS.listAppInstances, {})
    },
    {
      href: '/admin/app-store',
      label: 'App Store',
      authorized: can(PERMISSIONS.createApp, {})
    },
    {
      href: '/admin/notifications',
      label: 'Notifications',
      authorized: can(PERMISSIONS.listNotifications, {})
    },
    {
      href: '/admin/data-requests',
      label: 'Data Requests',
      authorized: can(PERMISSIONS.listWorkspaces, { workspace: '*' })
    },
    {
      href: '/admin/configuration',
      label: 'Configuration',
      authorized: can(PERMISSIONS.setPlatformSettings, {})
    },
    {
      href: '/admin/theme',
      label: 'Theme',
      authorized: can(PERMISSIONS.setPlatformSettings, {})
    }
  ]

  const handleTabChange = (value: string) => {
    router.push(value)
  }

  return (
    <Tabs value={pathname} onValueChange={handleTabChange} className="mb-4">
      <TabsList>
        {routes.map(
          (route) =>
            route.authorized && (
              <TabsTrigger
                key={route.href}
                value={route.href}
                className="text-accent data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-4"
              >
                {route.label}
              </TabsTrigger>
            )
        )}
      </TabsList>
    </Tabs>
  )
}
