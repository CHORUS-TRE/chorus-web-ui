'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

export function SettingsTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    {
      href: '/settings',
      label: 'Overview'
    },
    {
      href: '/settings/profile',
      label: 'Profile'
    },
    {
      href: '/settings/privacy',
      label: 'Privacy'
    }
  ]

  const handleTabChange = (value: string) => {
    router.push(value)
  }

  return (
    <Tabs value={pathname} onValueChange={handleTabChange} className="mb-4">
      <TabsList>
        {routes.map((route) => (
          <TabsTrigger
            key={route.href}
            value={route.href}
            className="text-foreground data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-4"
          >
            {route.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
