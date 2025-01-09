'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, LaptopMinimal } from 'lucide-react'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
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
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Workbench, Workspace } from '@/domain/model'

import { toast } from '~/hooks/use-toast'

import { ALBERT_WORKSPACE_ID, useAppState } from './store/app-state-context'

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
  const [deleted, setDeleted] = useState(false)
  const [updated, setUpdated] = useState(false)

  const { apps, appInstances, background } = useAppState()

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Workspace deleted',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [deleted])

  useEffect(() => {
    if (updated) {
      toast({
        title: 'Success!',
        description: 'Workspace updated',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [updated])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" id="grid">
      {workspaces?.map((workspace) => (
        <div key={workspace.id} className="group relative">
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                  {workspace?.id === ALBERT_WORKSPACE_ID
                    ? 'Home'
                    : workspace?.name}
                </CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-xs text-muted-foreground">
                  {
                    workbenches?.filter((w) => w.workspaceId === workspace.id)
                      ?.length
                  }{' '}
                  desktops running
                </p>
                <div className="mb-2 h-[120px] overflow-y-auto rounded-lg border border-muted/40 p-2">
                  {workbenches
                    ?.filter(
                      (workbench) => workbench.workspaceId === workspace?.id
                    )
                    .map(({ shortName, createdAt, id }) => (
                      <Link
                        key={workspace?.id}
                        href={`/workspaces/${workspace?.id}/desktops/${id}`}
                        className="flex flex-col justify-between rounded-lg border-muted/10 bg-background/40 p-1 text-white transition-colors duration-300 hover:border-accent hover:bg-accent/75 hover:text-primary hover:shadow-lg"
                      >
                        <div className="flex-grow text-sm">
                          <div className="flex items-center gap-2">
                            {background?.workbenchId === id ? (
                              <LaptopMinimal className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                            ) : (
                              <LaptopMinimal className="h-3.5 w-3.5 flex-shrink-0" />
                            )}
                            {shortName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {appInstances
                              ?.filter(
                                (instance) =>
                                  workspace?.id === instance.workspaceId
                              )
                              ?.filter(
                                (instance) => id === instance.workbenchId
                              )
                              .map((instance, index, array) => {
                                const appName =
                                  apps?.find((app) => app.id === instance.appId)
                                    ?.name || ''
                                const isLast = index === array.length - 1

                                return (
                                  <>
                                    {appName}
                                    {!isLast && ', '}
                                  </>
                                )
                              })}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
                <p>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs">
                  Updated {formatDistanceToNow(workspace.updatedAt)} ago
                </p>
              </CardContent>
            </Card>
          </Link>

          <WorkspaceUpdateForm
            workspace={workspace}
            state={[
              activeUpdateId === workspace.id,
              () => setActiveUpdateId(null)
            ]}
            onUpdate={() => {
              setUpdated(true)
              setTimeout(() => setUpdated(false), 3000)
              if (onUpdate) onUpdate()
            }}
          />

          <WorkspaceDeleteForm
            id={workspace.id}
            state={[
              activeDeleteId === workspace.id,
              () => setActiveDeleteId(null)
            ]}
            onUpdate={() => {
              setDeleted(true)
              setTimeout(() => setDeleted(false), 3000)
              if (onUpdate) onUpdate()
            }}
          />
        </div>
      ))}
    </div>
  )
}
