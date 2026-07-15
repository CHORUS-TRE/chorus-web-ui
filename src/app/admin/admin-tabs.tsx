'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthorization } from '@/providers/authorization-provider'

export function AdminTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const { can } = useAuthorization()

  const routes = [
    {
      href: '/admin',
      label: 'Overview',
      authorized: true
    },
    {
      href: '/admin/users',
      label: 'Users',
      authorized: can('listUsers', { user: '*' })
    },
    {
      href: '/admin/workspaces',
      label: 'Workspaces',
      authorized: can('listWorkspaces', { workspace: '*' })
    },
    {
      href: '/admin/sessions',
      label: 'Sessions',
      authorized: can('listWorkbenchs', { workspace: '*' })
    },
    {
      href: '/admin/instances',
      label: 'App Instances',
      authorized: can('listAppInstances', {})
    },
    {
      href: '/admin/app-store',
      label: 'App Store',
      authorized: can('createApp', {})
    },
    {
      href: '/admin/organizations',
      label: 'Organizations',
      authorized: can('setPlatformSettings', {})
    },
    {
      href: '/admin/data-requests',
      label: 'Data Requests',
      authorized: can('listWorkspaces', { workspace: '*' })
    },
    {
      href: '/admin/audit',
      label: 'Audit',
      authorized: can('auditPlatform', {})
    },
    {
      href: '/admin/configuration',
      label: 'Configuration',
      authorized: can('setPlatformSettings', {})
    },
    {
      href: '/admin/terms-of-use',
      label: 'Terms of Use',
      authorized: can('setPlatformSettings', {})
    }
  ]

  const handleTabChange = (value: string) => {
    router.push(value)
  }

  // Resolve active tab: match nested routes (e.g., /admin/users/roles → /admin/users)
  const activeTab =
    routes.find(
      (r) =>
        r.href !== '/admin' &&
        (pathname === r.href || pathname.startsWith(r.href + '/'))
    )?.href || pathname

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
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
