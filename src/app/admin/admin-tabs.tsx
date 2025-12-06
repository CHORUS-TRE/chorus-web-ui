'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

export function AdminTabs() {
  const pathname = usePathname()
  const router = useRouter()
  const { canManageUsers, canManageSettings } = useAuthorizationViewModel()

  const routes = [
    {
      href: '/admin/workspaces',
      label: 'Configurations',
      authorized: canManageSettings
    },
    { href: '/admin/theme', label: 'Theme', authorized: canManageSettings },
    { href: '/admin/users', label: 'Users', authorized: canManageUsers }
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
              <TabsTrigger key={route.href} value={route.href}>
                {route.label}
              </TabsTrigger>
            )
        )}
      </TabsList>
    </Tabs>
  )
}
