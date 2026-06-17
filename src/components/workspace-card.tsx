'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  HomeIcon,
  LaptopMinimal,
  MoreVertical,
  Package,
  Users
} from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Link } from '@/components/ui/link'
import { WorkspaceWithDev } from '@/domain/model'
import { useAuthorization } from '@/providers/authorization-provider'

interface WorkspaceCardProps {
  workspace: WorkspaceWithDev
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function WorkspaceCard({
  workspace,
  onEdit,
  onDelete
}: WorkspaceCardProps) {
  const { can } = useAuthorization()

  const canEdit = can('updateWorkspace', { workspace: workspace.id })
  const canDelete = can('deleteWorkspace', { workspace: workspace.id })
  const showMenu = (canEdit && onEdit) || (canDelete && onDelete)

  const memberCount =
    workspace.dev?.memberCount || workspace.dev?.members?.length || 0
  const sessionCount = workspace.dev?.workbenchCount || 0

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-muted/40 bg-contrast-background/70 shadow-none backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-contrast-background">
      {/* Stretched link — covers the whole card so the click target and border align */}
      <Link
        href={`/workspaces/${workspace.id}`}
        variant="plain"
        aria-label={workspace.name}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
            {workspace.dev?.image ? (
              <Image
                src={workspace.dev.image}
                alt={workspace.name}
                width={56}
                height={56}
                className="h-14 w-14 object-cover"
              />
            ) : workspace.isMain ? (
              <HomeIcon className="h-7 w-7 text-muted-foreground" />
            ) : (
              <Package className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1 pr-6">
            <CardTitle className="text-foreground">
              <span className="block truncate text-base font-semibold leading-tight">
                {workspace.name}
              </span>
            </CardTitle>
            {workspace.dev?.owner && (
              <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                {workspace.dev.owner}
              </span>
            )}
          </div>
        </div>

        {/* Footer — pinned to the bottom so every card aligns */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {memberCount}
            </span>
            <span className="flex items-center gap-1">
              <LaptopMinimal className="h-3.5 w-3.5 shrink-0" />
              {sessionCount}
            </span>
          </div>
          {workspace.createdAt && (
            <span className="text-[10px] font-medium text-muted-foreground">
              {formatDistanceToNow(workspace.createdAt)} ago
            </span>
          )}
        </div>
      </div>

      {/* Actions — sits above the stretched link */}
      {showMenu && (
        <div className="absolute right-2 top-2 z-20">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-muted/50 text-foreground backdrop-blur-sm hover:bg-muted hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-elevated">
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(workspace.id)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(workspace.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  )
}
