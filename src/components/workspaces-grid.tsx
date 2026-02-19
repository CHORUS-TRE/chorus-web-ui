'use client'
import { formatDistanceToNow } from 'date-fns'
import {
  Building2,
  HomeIcon,
  LaptopMinimal,
  MoreVertical,
  Package,
  Users
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'

import { Card, CardTitle } from '@/components/card'
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
import { User, WorkspaceWithDev } from '@/domain/model'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'

import { toast } from './hooks/use-toast'

interface WorkspacesGridProps {
  workspaces: WorkspaceWithDev[] | undefined
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
  const { can, PERMISSIONS } = useAuthorization()

  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)

  // Find the active workspace for dialogs, using a stable lookup
  const activeUpdateWorkspace = useMemo(
    () => workspaces?.find((w) => w.id === activeUpdateId),
    [workspaces, activeUpdateId]
  )
  const activeDeleteWorkspace = useMemo(
    () => workspaces?.find((w) => w.id === activeDeleteId),
    [workspaces, activeDeleteId]
  )

  const closeUpdate = useCallback(() => setActiveUpdateId(null), [])
  const closeDelete = useCallback(() => setActiveDeleteId(null), [])

  return (
    <>
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
              <Card className="relative flex flex-col overflow-hidden border-none bg-contrast-background/70 backdrop-blur-sm">
                {/* Content layer */}
                <Link
                  href={`/workspaces/${workspace.id}`}
                  variant="rounded"
                  className="relative flex h-full w-full flex-col p-4"
                >
                  {/* Top row: Image/Icon + Title + Users + Created */}
                  <div className="flex items-start gap-3">
                    {/* Left: Image or Icon (64px) */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                      {workspace.dev?.image ? (
                        <Image
                          src={workspace.dev.image}
                          alt={workspace.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-cover"
                        />
                      ) : workspace.isMain ? (
                        <HomeIcon className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    {/* Title + Users + Created */}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-foreground">
                        <span className="block text-base font-semibold leading-tight">
                          {workspace?.name}
                        </span>
                        <span className="text-base text-xs font-semibold">
                          {workspace?.dev?.owner}
                        </span>
                      </CardTitle>

                      {/* Users, Sessions and Created - below title */}
                      <div className="mt-3 flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 shrink-0" />
                            <span>
                              {workspace?.dev?.memberCount ||
                                workspace?.dev?.members?.length ||
                                0}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <LaptopMinimal className="h-3 w-3 shrink-0" />
                            <span>{workspace?.dev?.workbenchCount || 0}</span>
                          </span>
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          Created {formatDistanceToNow(workspace.createdAt)} ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description - full width below title */}
                  {/* {(() => {
                    const desc = (
                      workspace.dev?.config as WorkspaceConfig | undefined
                    )?.descriptionMarkdown
                    return desc ? (
                      <div className="prose prose-sm prose-muted dark:prose-invert mt-3 line-clamp-6 max-w-none text-xs text-muted-foreground">
                        <ReactMarkdown>{desc}</ReactMarkdown>
                      </div>
                    ) : null
                  })()} */}

                  {/* Spacer */}
                  {/* <div className="flex-1" /> */}
                </Link>

                {/* Dropdown menu - top right */}
                {(can(PERMISSIONS.deleteWorkspace, {
                  workspace: workspace.id
                }) ||
                  can(PERMISSIONS.updateWorkspace, {
                    workspace: workspace.id
                  })) && (
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
                      <DropdownMenuContent
                        align="end"
                        className="glass-elevated"
                      >
                        {can(PERMISSIONS.updateWorkspace, {
                          workspace: workspace.id
                        }) && (
                          <DropdownMenuItem
                            onClick={() =>
                              setActiveUpdateId(workspace.id || null)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                        )}
                        {can(PERMISSIONS.deleteWorkspace, {
                          workspace: workspace.id
                        }) && (
                          <DropdownMenuItem
                            onClick={() =>
                              setActiveDeleteId(workspace.id || null)
                            }
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
            </div>
          ))}
      </div>

      {/* Render dialogs outside .map() so they survive list re-renders */}
      <WorkspaceUpdateForm
        workspace={activeUpdateWorkspace}
        state={[!!activeUpdateId, closeUpdate]}
        onSuccess={() => {
          toast({
            title: 'Success!',
            description: 'Workspace updated'
          })
          if (onUpdate) onUpdate()
          refreshWorkspaces()
        }}
      />

      <WorkspaceDeleteForm
        id={activeDeleteWorkspace?.id}
        state={[!!activeDeleteId, closeDelete]}
        onSuccess={() => {
          refreshWorkspaces()
          toast({
            title: 'Success!',
            description: `Workspace ${activeDeleteWorkspace?.name} deleted`
          })
          if (onUpdate) onUpdate()
        }}
      />
    </>
  )
}
