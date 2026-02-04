'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { App, ExternalWebApp } from '~/domain/model'

interface SessionAppIconProps {
  app: App | ExternalWebApp
  onClick: () => void
  onLaunch: () => void
}

export function SessionAppIcon({
  app,
  onClick,
  onLaunch
}: SessionAppIconProps) {
  return (
    <div
      className="group pointer-events-auto flex cursor-pointer flex-col items-center gap-2 transition-all duration-300"
      onClick={onClick}
    >
      {/* The "Squircle" Icon */}
      <div
        className={cn(
          'relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22%] shadow-md transition-all duration-500',
          'bg-gradient-to-br from-white/10 to-black/20',
          'group-hover:translate-y-[-4px] group-hover:scale-105 group-hover:shadow-2xl',
          'active:translate-y-[2px] active:scale-95'
        )}
      >
        {/* Subtle Gloss effect */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40%] bg-gradient-to-b from-white/20 to-transparent" />

        {/* Shadow for the icon content */}
        <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]" />

        {(
          'iconURL' in app ? app.iconURL : 'iconUrl' in app ? app.iconUrl : null
        ) ? (
          <div className="relative h-14 w-14 transition-transform duration-500 group-hover:scale-110">
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
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <Avatar className="h-14 w-14 transition-transform duration-500 group-hover:scale-110">
            <AvatarFallback className="bg-muted/40 text-xl font-bold text-primary">
              {app.name?.slice(0, 1).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Label */}
      <span className="line-clamp-2 max-w-[84px] text-center text-[11px] font-medium text-foreground/90 drop-shadow-sm transition-colors group-hover:text-primary">
        {app.name}
      </span>
    </div>
  )
}
