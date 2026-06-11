'use client'

import { ShieldCheck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useAuthentication } from '@/providers/authentication-provider'

export default function UserSettingsPage() {
  useAuthentication()
  const router = useRouter()

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
      href: `/settings/profile/privacy`
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
                <div className="rounded-lg bg-accent/10 p-2 text-accent">
                  {setting.icon}
                </div>
                <CardTitle>{setting.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{setting.description}</CardDescription>
              <Button
                variant="link"
                className="mt-4 px-0 text-accent"
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
