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

export default function WorkspacesGrid({
  workspaces,
  user,
  onUpdate
}: WorkspacesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

  const { refreshWorkspaces, users } = useAppState()
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
          <Link href={`/workspaces/${workspace.id}`}>
            <Card className="h-full rounded-2xl border-muted/40 bg-background/60 text-white transition-colors duration-300 hover:border-accent hover:bg-background/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-start gap-3 pr-2 text-white hover:text-accent hover:underline">
                  {workspace.isMain && (
                    <HomeIcon className="h-6 w-6 text-secondary" />
                  )}
                  {!workspace.isMain && (
                    <Package className="h-6 w-6 flex-shrink-0" />
                  )}
                  <span className="flex items-center gap-2">
                    {workspace?.id === user?.workspaceId
                      ? 'My Workspace'
                      : workspace?.name}
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
                <ScrollArea className="h-[200px]" type="hover">
                  <WorkspaceWorkbenchList workspaceId={workspace.id} />
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
