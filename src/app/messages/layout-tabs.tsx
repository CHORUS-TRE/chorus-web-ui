'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useAuthorization } from '@/providers/authorization-provider'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

export function LayoutTabs() {
  const pathname = usePathname()
  const router = useRouter()

  // const { can, PERMISSIONS } = useAuthorization()

  const routes = [
    {
      href: '/messages',
      label: 'Overview',
      authorized: true
    },
    {
      href: '/messages/notifications',
      label: 'Notifications',
      authorized: true
    },
    {
      href: '/messages/requests',
      label: 'Requests',
      authorized: true
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
