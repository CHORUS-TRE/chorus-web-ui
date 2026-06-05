'use client'

import { Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabs = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/users/roles', label: 'Roles' }
]

export default function UsersLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()

  const activeTab =
    tabs.find(
      (t) =>
        t.href !== '/admin/users' &&
        (pathname === t.href || pathname.startsWith(t.href + '/'))
    )?.href ?? '/admin/users'

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Users className="h-9 w-9" />
        Users&apos; Management
      </h1>
      <p className="mb-4 text-muted-foreground">Manage users in the system.</p>

      <Tabs
        value={activeTab}
        onValueChange={(v) => router.push(v)}
        className="space-y-4"
      >
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.href} value={t.href}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
