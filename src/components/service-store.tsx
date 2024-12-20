'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'

import { StyledNavLink } from '~/app/workspaces/[workspaceId]/header'
import { App, AppType } from '~/domain/model'

import { appList } from './actions/app-view-model'
import { AvatarFallback, AvatarImage } from './ui/avatar'

export default function AppStore() {
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    appList().then((res) => {
      if (res.error) {
        setError(res.error)
        return
      }

      if (!res.data) {
        setError('There is no apps available')
        return
      }

      setApps(res.data.filter((app) => app.type === 'service'))
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-black/85 backdrop-blur-sm"></header>

      <main className="flex flex-1">
        {error && (
          <div className="absolute bottom-4 right-4 z-50 w-96">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
              <h4 className="mb-1 font-medium">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex-1 p-6">
          <h1 className="mb-6 text-2xl font-semibold text-white">
            All Services
          </h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                id={app.id}
                name={app.name || ''}
                icon={app.name === 'vscode' ? '/vscode.png' : undefined}
                action="Start"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function AppCard({
  id,
  name,
  icon,
  action,
  version
}: {
  id: string
  name: string
  icon?: string
  action: 'Start'
  version?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-center">
      <Avatar className="mb-4">
        <AvatarImage src={icon} className="m-auto h-8 w-8" />
        <AvatarFallback className="m-auto h-8 w-8">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <h3 className="mb-1 text-sm font-medium">{name}</h3>
      {version && <p className="text-xs text-muted">{version}</p>}
      <Link href={`/services/${id}`} passHref>
        <Button variant="secondary" className="mt-4">
          {action}
        </Button>
      </Link>
    </div>
  )
}
