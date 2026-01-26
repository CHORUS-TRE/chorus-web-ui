'use client'

import { ShieldCheck, User } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'

export default function UserSettingsPage() {
  const params = useParams<{ userId: string }>()
  const userId = params?.userId
  const router = useRouter()

  const settings = [
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Manage your privacy settings and cookie consent.',
      icon: <ShieldCheck className="h-5 w-5" />,
      href: `/users/${userId}/settings/privacy`
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <User className="h-8 w-8" />
          User Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settings.map((setting) => (
          <Card
            key={setting.id}
            className="cursor-pointer transition-colors hover:bg-muted/50"
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
