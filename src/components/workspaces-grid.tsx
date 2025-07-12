'use client'

import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, HomeIcon, Package } from 'lucide-react'
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
import { User, Workbench, Workspace } from '@/domain/model'

import { toast } from './hooks/use-toast'
import { ScrollArea } from './ui/scroll-area'
import { WorkspaceWorkbenchList } from './workspace-workbench-list'

interface WorkspacesGridProps {
  workspaces: Workspace[] | undefined
  workbenches: Workbench[] | undefined
  user: User | undefined
  onUpdate?: () => void
}

const SwitchLink = ({ user, workspace, children }: { user: User, workspace: Workspace, children: React.ReactNode }) => {
  return workspace.userId === user?.id ?
    <Link href={`/workspaces/${workspace.id}`} className="transition-colors duration-300 hover:border-accent hover:bg-background/80 cursor-pointer">
    {children}
  </Link> : <>{children}</>
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
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      id="grid"
    >
      {workspaces?.map((workspace) => (
        <div key={`workspace-grid-${workspace.id}`} className="group relative">
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
          <SwitchLink user={user} workspace={workspace} >
            <Card className="h-full rounded-2xl border-muted/40 bg-background/60 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-start gap-3 pr-2 text-white">
                  {workspace.isMain && workspace.userId === user?.id && (
                    <HomeIcon className="h-6 w-6 text-secondary" />
                  )}
                  {!workspace.isMain && (
                    <Package className="h-6 w-6 flex-shrink-0" />
                  )}
                  <span className="flex items-center gap-2">
                    {workspace?.name}
                  </span>
                </CardTitle>
                <CardDescription>{workspace?.description}</CardDescription>
                <div className="mb-3 text-xs text-muted">
                  Created {formatDistanceToNow(workspace.updatedAt)} ago by{' '}
                  {
                    users?.find((user) => user.id === workspace?.userId)
                      ?.firstName
                  }{' '}
                  {
                    users?.find((user) => user.id === workspace?.userId)
                      ?.lastName
                  }
                </div>
              </CardHeader>
              <CardContent>
                {workspace.userId === user?.id && (
                <ScrollArea className="h-[200px]" type="hover">
                  <WorkspaceWorkbenchList workspaceId={workspace.id} />
                </ScrollArea>
                )}
                {workspace.userId !== user?.id && (

                  <div className="flex items-start justify-center h-full">
                    <p className="text-muted">{workbenches?.filter(w => w.workspaceId === workspace.id).length || 0 }
                      sessions
                    </p>
                  </div>
                )}
              </CardContent>
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
