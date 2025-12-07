'use client'

import { ExternalLink, Globe } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ExternalWebApp } from '@/domain/model'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/card'

import { Avatar, AvatarFallback } from './ui/avatar'

interface WebAppCardProps {
  webapp: ExternalWebApp
}

/**
 * Card component for displaying an external web app in the App Store.
 * Clicking "Open" will load the webapp in a cached iframe.
 */
export function WebAppCard({ webapp }: WebAppCardProps) {
  const router = useRouter()
  const { openWebApp, cachedIframes } = useIframeCache()

  const isOpen = cachedIframes.has(webapp.id)

  const handleOpen = () => {
    openWebApp(webapp.id)
    router.push(`/webapps/${webapp.id}`)
  }

  return (
    <Card>
      <CardHeader className="relative pb-4">
        <div className="flex items-center space-x-4">
          {webapp.iconUrl ? (
            <Image
              src={webapp.iconUrl}
              alt={webapp.name}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded"
              priority
            />
          ) : (
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-green-500/20 text-green-500">
                <Globe className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          <CardTitle className="flex items-center gap-2 truncate text-ellipsis pr-2 text-muted-foreground">
            {webapp.name}
          </CardTitle>
        </div>
        <CardDescription className="mb-3 truncate text-xs text-muted-foreground">
          {new URL(webapp.url).hostname}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {webapp.description || 'External web application'}
        </div>
      </CardContent>
      <CardFooter className="mt-auto gap-2">
        <Button onClick={handleOpen} className="small">
          <ExternalLink className="mr-2 h-4 w-4" />
          {isOpen ? 'Go to App' : 'Open'}
        </Button>
        {isOpen && (
          <span className="text-xs text-green-500">
            <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Open
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
