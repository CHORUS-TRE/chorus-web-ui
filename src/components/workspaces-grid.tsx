'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  CirclePlus,
  EllipsisVerticalIcon,
  HomeIcon,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Workbench, Workspace } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'

import { WorkbenchCreateForm } from './forms/workbench-create-form'
import { toast } from './hooks/use-toast'
import { ScrollArea } from './ui/scroll-area'
import { WorkspaceWorkbenchList } from './workspace-workbench-list'

interface WorkspacesGridProps {
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  user: User | undefined
  onUpdate?: () => void
}

const SwitchLink = ({
  user,
  workspace,
  children
}: {
  user: User
  workspace: Workspace
  children: React.ReactNode
}) => {
  return workspace.userId === user?.id ? (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="cursor-pointer transition-colors duration-300 hover:border-accent hover:bg-background/80"
    >
      {children}
    </Link>
  ) : (
    <>{children}</>
  )
}

export default function WorkspacesGrid({
  workspaces,
  user,
  onUpdate
}: WorkspacesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

  const { refreshWorkspaces, users, workbenches } = useAppState()
  return (
    <div
      className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]"
      id="grid"
    >
      {user &&
        workspaces?.map((workspace) => (
          <div
            key={`workspace-grid-${workspace.id}`}
            className="group relative"
          >
            <div className="absolute right-4 top-4 z-10">
              {workspace.userId === user?.id && (
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
                  <DropdownMenuContent
                    align="end"
                    className="bg-black text-white"
                  >
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
              )}
            </div>
            <SwitchLink user={user} workspace={workspace}>
              <Card className="h-full rounded-2xl border-muted/40 bg-background/60 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start gap-3 pr-2 text-white">
                    {workspace.isMain && workspace.userId === user?.id && (
                      <HomeIcon className="h-6 w-6 text-white" />
                    )}
                    {!workspace.isMain && (
                      <Package className="h-6 w-6 flex-shrink-0" />
                    )}
                    <span className="flex items-center gap-2">
                      {workspace?.name}
                    </span>
                  </CardTitle>
                  <CardDescription className="">
                    {workspace?.description}
                    <span className="mb-2 block text-xs text-muted">
                      Created {formatDistanceToNow(workspace.createdAt)} ago by{' '}
                      {
                        users?.find((user) => user.id === workspace?.userId)
                          ?.firstName
                      }{' '}
                      {
                        users?.find((user) => user.id === workspace?.userId)
                          ?.lastName
                      }
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  {workspace.userId === user?.id && (
                    <ScrollArea
                      className="flex max-h-40 flex-col overflow-y-auto"
                      type="hover"
                    >
                      <WorkspaceWorkbenchList workspaceId={workspace.id} />
                    </ScrollArea>
                  )}
                  {workspace.userId !== user?.id && (
                    <div className="flex h-full items-start justify-start">
                      <div className="text-xs text-muted">
                        {(() => {
                          const count =
                            workbenches?.filter(
                              (w) => w.workspaceId === workspace.id
                            ).length || 0
                          return `${count} workbench${count !== 1 ? 'es' : ''}`
                        })()}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-end justify-start">
                  {workspace.userId === user?.id && (
                    <WorkbenchCreateForm
                      workspaceId={workspace?.id || ''}
                      workspaceName={workspace?.name}
                    />
                  )}
                </CardFooter>
              </Card>
            </SwitchLink>

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
