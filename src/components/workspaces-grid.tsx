'use client'
import { formatDistanceToNow } from 'date-fns'
import { HomeIcon, MoreVertical, Package } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Card, CardDescription, CardTitle } from '@/components/card'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { Link } from '@/components/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Workspace } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/button'
import { Badge } from '~/components/ui/badge'

import { toast } from './hooks/use-toast'

interface WorkspacesGridProps {
  workspaces: Workspace[] | undefined
  user: User | undefined
  onUpdate?: () => void
}

export default function WorkspacesGrid({
  workspaces,
  user,
  onUpdate
}: WorkspacesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

  const { refreshWorkspaces } = useAppState()

  return (
    <div
      className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,280px))]"
      id="workspaces-grid"
    >
      {user &&
        workspaces?.map((workspace) => (
          <div
            key={`workspace-grid-${workspace.id}`}
            className="group relative"
          >
            <Card className="group/card relative flex h-40 flex-col overflow-hidden border-none">
              {/* Background image */}
              <div className="absolute inset-0 bg-muted/20">
                {workspace.image && (
                  <Image
                    src={workspace.image}
                    alt={workspace.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Glass overlay - fades out on hover to reveal image */}
              <div className="absolute inset-0 bg-contrast-background/70 backdrop-blur-sm transition-opacity duration-300 group-hover/card:opacity-0" />

              {/* Content layer */}
              <Link
                href={`/workspaces/${workspace.id}`}
                variant="rounded"
                className={`relative flex h-full w-full flex-col items-start justify-between p-4 ${workspace.image ? 'group-hover/card:opacity-0' : ''}`}
              >
                {/* Title - top left, can wrap */}
                <div className="pr-10">
                  <CardTitle className="flex items-start gap-2 text-foreground">
                    {workspace.isMain ? (
                      <HomeIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Package className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    )}
                    <span className="text-lg font-semibold leading-tight">
                      {workspace?.name}
                    </span>
                  </CardTitle>
                </div>

                {/* Spacer to push bottom content down */}
                <div className="flex-1" />

                {/* Bottom info - owner, date, badge */}
                <CardDescription className="flex w-full items-end justify-between text-xs text-muted-foreground">
                  <span className="block">
                    <span className="text-md block font-semibold text-foreground">
                      Owner: {workspace?.owner || '-'}
                    </span>
                    <span className="block">
                      {workspace?.memberCount || 0}{' '}
                      {workspace?.memberCount === 1 ? 'member' : 'members'} |{' '}
                      {workspace?.workbenchCount || 0}{' '}
                      {workspace?.workbenchCount === 1 ? 'session' : 'sessions'}
                    </span>
                    <span className="block">
                      Created {formatDistanceToNow(workspace.createdAt)} ago
                    </span>
                  </span>
                  {workspace.tag && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {workspace.tag}
                    </Badge>
                  )}
                </CardDescription>
              </Link>

              {/* Dropdown menu - top right */}
              {user?.rolesWithContext?.some(
                (role) => role.context.workspace === workspace.id
              ) && (
                <div className="absolute right-2 top-2 z-10">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-elevated">
                      <DropdownMenuItem
                        onClick={() => setActiveUpdateId(workspace.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setActiveDeleteId(workspace.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Card>

            {activeUpdateId === workspace.id && (
              <WorkspaceUpdateForm
                workspace={workspace}
                state={[
                  activeUpdateId === workspace.id,
                  () => setActiveUpdateId(null)
                ]}
                onSuccess={() => {
                  toast({
                    title: 'Success!',
                    description: 'Workspace updated'
                  })
                  if (onUpdate) onUpdate()
                }}
              />
            )}

            {activeDeleteId === workspace.id && (
              <WorkspaceDeleteForm
                id={workspace.id}
                state={[
                  activeDeleteId === workspace.id,
                  () => setActiveDeleteId(null)
                ]}
                onSuccess={() => {
                  refreshWorkspaces()

                  toast({
                    title: 'Success!',
                    description: `Workspace ${workspace.name} deleted`
                  })
                  if (onUpdate) onUpdate()
                }}
              />
            )}
          </div>
        ))}
    </div>
  )
}
