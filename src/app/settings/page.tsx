'use client'

import { ShieldCheck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { getRoleScope, RoleBadge } from '@/components/role-badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useAuthentication } from '@/providers/authentication-provider'
import { useRoles } from '@/providers/roles-provider'

export default function UserSettingsPage() {
  const { user } = useAuthentication()
  const { rolesByName } = useRoles()
  const router = useRouter()

  const roles = useMemo(() => user?.rolesWithContext || [], [user])

  const platformRoles = useMemo(
    () => roles.filter((r) => getRoleScope(r.name, rolesByName) === 'platform'),
    [roles, rolesByName]
  )
  const workspaceRoles = useMemo(
    () => roles.filter((r) => getRoleScope(r.name, rolesByName) === 'workspace'),
    [roles, rolesByName]
  )
  const sessionRoles = useMemo(
    () => roles.filter((r) => getRoleScope(r.name, rolesByName) === 'session'),
    [roles, rolesByName]
  )

  const settings = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your profile information.',
      icon: <User className="h-5 w-5" />,
      href: `/settings/profile`
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Manage your privacy settings and cookie consent.',
      icon: <ShieldCheck className="h-5 w-5" />,
      href: `/settings/privacy`
    }
  ]

  return (
    <div className="container mx-auto space-y-6 py-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            className="cursor-pointer transition-colors hover:border-accent/40"
            onClick={() => router.push(setting.href)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {setting.icon}
                </div>
                <CardTitle>{setting.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{setting.description}</CardDescription>
              <Button
                variant="link"
                className="mt-4 px-0 text-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(setting.href)
                }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
