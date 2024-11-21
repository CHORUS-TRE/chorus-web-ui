'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Avatar } from '@radix-ui/react-avatar'

import { App } from '~/domain/model'

import { appList } from './actions/app-view-model'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'

export default function AppStore() {
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState<string>()
  const [selectedType, setSelectedType] = useState<'app' | 'service'>('app')

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

      setApps(res.data)
    })
  }, [])

  const filteredApps = apps.filter((app) => app.type === selectedType)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-black/85 backdrop-blur-sm"></header>

      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4">
          <nav className="space-y-2">
            <div className="flex flex-col gap-4">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedType('app')
                }}
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent px-2 text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent"
              >
                IDEs
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedType('service')
                }}
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent px-2 text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent"
              >
                Data
              </Link>
            </div>
          </nav>
        </aside>

        <div className="flex-1 p-6">
          <h1 className="mb-6 text-2xl font-semibold text-white">
            {selectedType}s
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                id={app.id}
                name={app.name || ''}
                description={app.description || ''}
                icon={app.name === 'vscode' ? '/vscode.png' : undefined}
                action="Start"
                href={`/app-store/${app.id}`}
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
  description,
  icon,
  action,
  version,
  href
}: {
  id: string
  name: string
  description: string
  icon?: string
  action: 'Start'
  version?: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card
        className="flex h-full flex-col justify-between rounded-2xl border-transparent bg-background text-white transition duration-300 hover:border-accent hover:shadow-lg"
        key={id}
      >
        <CardHeader className="">
          <CardTitle>
            <Avatar>
              <AvatarImage src={icon} className="m-auto h-8 w-8" />
              <AvatarFallback className="m-auto h-8 w-8">
                {name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </CardTitle>
          <CardDescription className="text-white">{name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
