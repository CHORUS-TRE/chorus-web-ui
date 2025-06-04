'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  EllipsisVerticalIcon,
  LaptopMinimal,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const { apps, appInstances, refreshWorkspaces, users } = useAppState()
  const router = useRouter()
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
            <Card className="h-full rounded-2xl border-muted/40 bg-background/40 text-white transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-start gap-3 pr-2 text-white">
                  <Package className="h-6 w-6 flex-shrink-0 text-white" />
                  {workspace?.id === user?.workspaceId
                    ? 'Home'
                    : workspace?.name}
                </CardTitle>
                <CardDescription>
                  {workspace?.description}
                  <p className="mb-3 text-xs text-muted">
                    Created {formatDistanceToNow(workspace.updatedAt)} ago by{' '}
                    {
                      users?.find((user) => user.id === workspace?.userId)
                        ?.firstName
                    }{' '}
                    {
                      users?.find((user) => user.id === workspace?.userId)
                        ?.lastName
                    }
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                  <LaptopMinimal className="h-4 w-4 shrink-0" />
                  Sessions
                </div>

                <ScrollArea className="mb-4 max-h-[160px] pr-2">
                  <div className="grid gap-1">
                    {workbenches?.filter(
                      (workbench) => workbench.workspaceId === workspace?.id
                    ).length === 0 && (
                      <div className="mb-1 flex items-center gap-2 text-xs">
                        <LaptopMinimal className="h-4 w-4 shrink-0" />
                        No sessions created yet
                      </div>
                    )}

                    {workbenches
                      ?.filter(
                        (workbench) => workbench.workspaceId === workspace?.id
                      )
                      .map(({ userId, createdAt, id }) => (
                        <div
                          key={`workspace-grid-sessions-${id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push(
                              `/workspaces/${workspace?.id}/sessions/${id}`
                            )
                          }}
                          className="cursor-pointer justify-between bg-background/40 text-white"
                        >
                          <div className="mb-2 flex-grow text-xs">
                            {/* <div className="mb-1 flex items-center gap-2">
                              <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                              {shortName}
                            </div> */}

                            <div className="mt-1 text-xs">
                              <div className="mb-1 flex items-center gap-2 text-xs hover:text-accent hover:underline">
                                <AppWindow className="h-4 w-4 shrink-0" />
                                {appInstances
                                  ?.filter(
                                    (instance) =>
                                      workspace?.id === instance.workspaceId
                                  )
                                  ?.filter(
                                    (instance) => id === instance.sessionId
                                  ).length === 0 && (
                                  <span className="text-muted">
                                    No apps started yet
                                  </span>
                                )}
                                {appInstances
                                  ?.filter(
                                    (instance) =>
                                      workspace?.id === instance.workspaceId
                                  )
                                  ?.filter(
                                    (instance) => id === instance.sessionId
                                  )
                                  .map(
                                    (instance) =>
                                      apps?.find(
                                        (app) => app.id === instance.appId
                                      )?.name || ''
                                  )
                                  .join(', ')}
                              </div>
                              <p className="text-xs text-muted">
                                Created{' '}
                                {formatDistanceToNow(createdAt || new Date())}{' '}
                                ago by{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.firstName
                                }{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.lastName
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
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
