'use client'

import { formatDistanceToNow } from 'date-fns'
import { Plus } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import { App, ExternalWebApp } from '@/domain/model'

interface SessionAppListItemProps {
  app: App | ExternalWebApp
  onLaunch: () => void
}

export function SessionAppListItem({ app, onLaunch }: SessionAppListItemProps) {
  const iconSrc =
    'iconURL' in app ? app.iconURL : 'iconUrl' in app ? app.iconUrl : null

  const createdAt = 'createdAt' in app ? (app as App).createdAt : undefined
  const updatedAt = 'updatedAt' in app ? (app as App).updatedAt : undefined

  return (
    <TableRow className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
      <TableCell className="w-[50px] p-2">
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-muted/10 bg-background/40 p-1">
          {iconSrc ? (
            <Image
              src={iconSrc as string}
              alt={app.name || 'App icon'}
              fill
              className="object-contain p-0.5"
            />
          ) : (
            <Avatar className="h-full w-full">
              <AvatarFallback className="text-[10px] font-bold">
                {app.name?.slice(0, 2).toUpperCase() || 'AP'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </TableCell>
      <TableCell className="p-2 font-medium">{app.name}</TableCell>
      <TableCell className="max-w-[250px] truncate p-2 text-sm text-muted-foreground">
        {app.description || '—'}
      </TableCell>
      <TableCell className="p-2 text-sm">
        {'dockerImageTag' in app && app.dockerImageTag ? (
          <span className="rounded-full bg-muted/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            {app.dockerImageTag}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="p-2 text-xs text-muted-foreground">
        {createdAt
          ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
          : '—'}
      </TableCell>
      <TableCell className="p-2 text-xs text-muted-foreground">
        {updatedAt
          ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
          : '—'}
      </TableCell>
      <TableCell className="p-2 text-right">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onLaunch()
          }}
          size="sm"
          variant="ghost"
          className="h-7 rounded-lg px-2 text-[10px] text-accent transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
        >
          <Plus className="mr-1 h-3 w-3" />
          Launch
        </Button>
      </TableCell>
    </TableRow>
  )
}
