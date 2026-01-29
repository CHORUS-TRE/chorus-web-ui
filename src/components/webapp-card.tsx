import { Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ExternalWebApp } from '@/domain/model'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { Card, CardDescription, CardTitle } from '~/components/card'
import { Badge } from '~/components/ui/badge'

import { Avatar, AvatarFallback } from './ui/avatar'

interface WebAppCardProps {
  webapp: ExternalWebApp
}

/**
 * Card component for displaying an external web app in the App Store.
 * Clicking "Open" will load the webapp in a cached iframe.
 */
export function WebAppCard({ webapp }: WebAppCardProps) {
  const { openWebApp, cachedIframes } = useIframeCache()

  const isOpen = cachedIframes.has(webapp.id)

  const handleOpen = () => {
    openWebApp(webapp.id)
  }

  return (
    <div className="group relative">
      <Card className="group/card relative flex h-40 flex-col overflow-hidden border-none">
        {/* Background */}
        <div className="absolute inset-0 bg-muted/20" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-contrast-background/70 backdrop-blur-sm" />

        {/* Content layer */}
        <Link
          href={`/sessions/${webapp.id}`}
          className="relative flex h-full w-full flex-col items-start justify-between p-4"
          onClick={handleOpen}
        >
          {/* Title - top left */}
          <div className="w-full pr-5">
            <CardTitle className="flex items-start gap-2 text-foreground">
              {webapp.iconUrl ? (
                <Image
                  src={webapp.iconUrl}
                  alt={webapp.name}
                  width={20}
                  height={20}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded"
                />
              ) : (
                <Avatar className="mt-0.5 h-5 w-5 shrink-0">
                  <AvatarFallback className="bg-transparent text-foreground">
                    <Globe className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate text-lg font-semibold leading-tight">
                {webapp.name}
              </span>
            </CardTitle>
            <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
              {webapp.description || 'Web application'}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom info */}
          <CardDescription className="flex w-full items-end justify-between text-sm text-muted-foreground">
            <span className="block w-full">
              <span className="block truncate">
                {new URL(webapp.url).hostname}
              </span>
            </span>

            {isOpen && (
              <Badge variant="default" className="ml-2 bg-green-500/80 text-xs">
                Open
              </Badge>
            )}
          </CardDescription>
        </Link>
      </Card>
    </div>
  )
}
