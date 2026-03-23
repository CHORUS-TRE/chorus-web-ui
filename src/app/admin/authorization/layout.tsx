'use client'

import { KeyRound, Shield, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const routes = [
  { href: '/admin/authorization/roles', label: 'Roles', icon: Shield },
  { href: '/admin/authorization/users', label: 'Users', icon: Users },
  {
    href: '/admin/authorization/permissions',
    label: 'Permissions',
    icon: KeyRound
  }
]

export default function AuthorizationLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()

  const activeTab =
    routes.find((r) => pathname === r.href || pathname.startsWith(r.href + '/'))
      ?.href || routes[0].href

  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
          <Shield className="h-9 w-9" />
          Authorization
        </h1>
        <p className="mb-4 text-muted-foreground">
          Manage roles, permissions, and access control policies.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => router.push(v)}
        className="space-y-4"
      >
        <TabsList>
          {routes.map((route) => (
            <TabsTrigger key={route.href} value={route.href}>
              {route.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
