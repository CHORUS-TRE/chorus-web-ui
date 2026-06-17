'use client'

import { formatDistanceToNow } from 'date-fns'
import { Globe, Mail, Package } from 'lucide-react'

import { Card, CardTitle } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { PublicWorkspace } from '@/domain/model/public-workspace'
import { cn } from '@/lib/utils'

interface PublicWorkspaceCardProps {
  workspace: PublicWorkspace
  isMember?: boolean
}

export function PublicWorkspaceCard({
  workspace,
  isMember
}: PublicWorkspaceCardProps) {
  const contactName = [workspace.contactFirstName, workspace.contactLastName]
    .filter(Boolean)
    .join(' ')

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border-muted/40 bg-contrast-background/70 shadow-none backdrop-blur-sm transition-colors',
        isMember && 'hover:border-accent/40 hover:bg-contrast-background'
      )}
    >
      {/* Member workspaces are navigable — stretched link keeps the click target aligned */}
      {isMember && (
        <Link
          href={`/workspaces/${workspace.id}`}
          variant="plain"
          aria-label={workspace.name}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
            <Package className="h-7 w-7 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1 pr-14">
            <CardTitle className="text-foreground">
              <span className="block truncate text-base font-semibold leading-tight">
                {workspace.name}
              </span>
            </CardTitle>
            {contactName && (
              <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                {contactName}
              </span>
            )}
          </div>
        </div>

        {workspace.description && (
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {workspace.description}
          </p>
        )}

        {/* Footer — pinned to the bottom so every card aligns */}
        <div className="mt-auto flex items-center justify-between pt-4 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            Public
          </span>
          {workspace.contactEmail ? (
            <span className="flex min-w-0 items-center gap-1 text-[10px] font-medium">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{workspace.contactEmail}</span>
            </span>
          ) : (
            workspace.createdAt && (
              <span className="text-[10px] font-medium">
                {formatDistanceToNow(workspace.createdAt)} ago
              </span>
            )
          )}
        </div>
      </div>

      {isMember && (
        <span className="absolute right-2 top-2 z-20 rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
          Member
        </span>
      )}
    </Card>
  )
}
