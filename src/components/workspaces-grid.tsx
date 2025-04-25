'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  DraftingCompass,
  EllipsisVerticalIcon,
  LaptopMinimal
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { useAppState } from '@/components/store/app-state-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, Workbench, Workspace } from '@/domain/model'

interface WorkspacesGridProps {
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  user: User | undefined
  onUpdate?: () => void
}

export default function WorkspacesGrid({
  workspaces,
  workbenches,
  user,
  onUpdate
}: WorkspacesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)
  const { setNotification } = useAppState()
  const { apps, appInstances, refreshWorkspaces } = useAppState()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" id="grid">
      {workspaces?.map((workspace) => (
        <div key={`workspace-grid-${workspace.id}`} className="group relative">
          <div className="absolute right-4 top-4 z-10">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                  className="text-muted hover:bg-background/20 hover:text-accent"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white">
                {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
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
          <Link href={`/workspaces/${workspace.id}`}>
            <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 text-white transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg">
              <CardHeader>
                <CardTitle>
                  {workspace?.id === user?.workspaceId
                    ? 'Home'
                    : workspace?.name}
                </CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="mb-4 h-[160px] pr-2">
                  <div className="grid gap-1">
                    {workbenches
                      ?.filter(
                        (workbench) => workbench.workspaceId === workspace?.id
                      )
                      .map(({ shortName, createdAt, id }) => (
                        <div
                          key={`workspace-grid-desktops-${id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            window.location.href = `/workspaces/${workspace?.id}/desktops/${id}`
                          }}
                          className="cursor-pointer justify-between rounded-lg border border-muted/30 bg-background/40 p-2 text-white transition-colors duration-300 hover:border-accent hover:shadow-lg"
                        >
                          <div className="mb-0.5 flex-grow text-sm">
                            <div className="mb-1 flex items-center gap-2">
                              <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                              {shortName}
                            </div>
                            <p className="text-xs text-muted">
                              {formatDistanceToNow(createdAt)} ago
                            </p>
                            <div className="mt-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2 text-xs">
                                <DraftingCompass className="h-4 w-4 shrink-0" />
                                {appInstances
                                  ?.filter(
                                    (instance) =>
                                      workspace?.id === instance.workspaceId
                                  )
                                  ?.filter(
                                    (instance) => id === instance.workbenchId
                                  )
                                  .slice(0, 3)
                                  .map(
                                    (instance) =>
                                      apps?.find(
                                        (app) => app.id === instance.appId
                                      )?.name || ''
                                  )
                                  .join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
                <p className="text-xs text-muted-foreground">
                  Owner: {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(workspace.updatedAt)} ago
                </p>
              </CardContent>
            </Card>
          </Link>

          {activeUpdateId === workspace.id && (
            <WorkspaceUpdateForm
              workspace={workspace}
              state={[
                activeUpdateId === workspace.id,
                () => setActiveUpdateId(null)
              ]}
              onUpdate={() => {
                setNotification({
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
              onUpdate={() => {
                refreshWorkspaces()

                setNotification({
                  title: 'Success!',
                  description: 'Workspace deleted'
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
