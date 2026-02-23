'use client'

import { Plus } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button } from '~/components/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { App, ExternalWebApp } from '~/domain/model'

interface SessionAppListItemProps {
  app: App | ExternalWebApp
  onLaunch: () => void
}

export function SessionAppListItem({ app, onLaunch }: SessionAppListItemProps) {
  return (
    <div className="group pointer-events-auto flex items-center justify-between rounded-xl border border-muted/10 bg-contrast-background/10 p-2 backdrop-blur-md transition-all duration-300 hover:bg-contrast-background/20">
      <div className="flex min-w-0 items-center gap-3">
        {/* Icon */}
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-muted/10 bg-background/40 p-1.5 transition-transform group-hover:scale-105">
          {(
            'iconURL' in app
              ? app.iconURL
              : 'iconUrl' in app
                ? app.iconUrl
                : null
          ) ? (
            <Image
              src={
                ('iconURL' in app
                  ? app.iconURL
                  : 'iconUrl' in app
                    ? app.iconUrl
                    : '') as string
              }
              alt={app.name || 'App icon'}
              fill
              className="object-contain p-1"
            />
          ) : (
            <Avatar className="h-full w-full">
              <AvatarFallback className="text-[10px] font-bold">
                {app.name?.slice(0, 2).toUpperCase() || 'AP'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-xs font-bold text-foreground transition-colors group-hover:text-primary">
            {app.name}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {app.description || 'No description available.'}
          </p>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-end gap-4 pr-8">
        {'dockerImageTag' in app && app.dockerImageTag && (
          <span className="hidden rounded-full bg-muted/20 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground sm:inline-block">
            v{app.dockerImageTag}
          </span>
        )}
        <Button
          onClick={onLaunch}
          size="sm"
          variant="ghost"
          className="h-7 rounded-lg px-2 text-[10px] text-accent transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
        >
          <Plus className="mr-1 h-3 w-3" />
          Launch
        </Button>
      </div>
    </div>
  )
}
