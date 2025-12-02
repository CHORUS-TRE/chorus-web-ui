'use client'

import { Box, Palette, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

export function AdminTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    { href: '/admin', label: 'Theme' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/workspaces', label: 'Workspaces', disabled: true }
  ]

  const handleTabChange = (value: string) => {
    router.push(value)
  }

  return (
    <Tabs value={pathname} onValueChange={handleTabChange} className="mb-4">
      <TabsList>
        {routes.map((route) => (
          <TabsTrigger key={route.href} value={route.href} disabled={route.disabled === true}>
            {route.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
