'use client'

import { formatDistanceToNow } from 'date-fns'
import { HomeIcon, Package } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Card } from '@/components/card'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { User, Workbench, Workspace } from '@/domain/model'
import { cn } from '@/lib/utils'
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
  children,
  className
}: {
  user: User
  workspace: Workspace
  children: React.ReactNode
  className?: string
}) => {
  return workspace.id ===
    user.rolesWithContext?.find(
      (role) => role.context.workspace === workspace.id
    )?.context.workspace ? (
    <Link
      href={`/workspaces/${workspace.id}`}
      className={cn(
        'cursor-pointer truncate text-nowrap border-b border-transparent text-muted transition-colors duration-300 hover:border-accent hover:text-accent',
        className
      )}
      title={workspace?.name}
    >
      {children}
    </Link>
  ) : (
    <span className={className}>{children}</span>
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
            <div className="absolute right-0 top-0 z-10">
              {user?.rolesWithContext?.some(
                (role) => role.context.workspace === workspace.id
              ) && (
                <DropdownMenu modal={false}>
                  <DropdownMenuContent align="end" className="glass-popover">
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

            <Card
              title={
                <>
                  {workspace.isMain && (
                    <HomeIcon className="h-6 w-6 flex-shrink-0 text-muted" />
                  )}
                  {!workspace.isMain && (
                    <Package className="h-6 w-6 flex-shrink-0 text-muted" />
                  )}
                  <SwitchLink
                    user={user}
                    workspace={workspace}
                    className="min-w-0 flex-1 truncate text-nowrap"
                  >
                    {workspace?.name}
                  </SwitchLink>
                </>
              }
              description={
                <>
                  <span className="text-xs">
                    Owner:{' '}
                    {
                      users?.find((user) => user.id === workspace?.userId)
                        ?.firstName
                    }{' '}
                    {
                      users?.find((user) => user.id === workspace?.userId)
                        ?.lastName
                    }
                  </span>
                  <span className="block text-xs">
                    Created {formatDistanceToNow(workspace.createdAt)} ago{' '}
                  </span>
                </>
              }
              content={
                <div className="">
                  <div className="mb-2 border-b border-muted/40 pb-2 text-xs font-bold text-muted-foreground">
                    {(() => {
                      const count =
                        workbenches?.filter(
                          (w) => w.workspaceId === workspace.id
                        ).length || 0
                      return `${count} active session${count !== 1 ? 's' : ''}`
                    })()}
                  </div>
                  <ScrollArea
                    className="flex max-h-40 flex-col overflow-y-auto"
                    type="hover"
                  >
                    <WorkspaceWorkbenchList workspaceId={workspace.id} />
                  </ScrollArea>
                </div>
              }
              footer={
                <WorkbenchCreateForm
                  workspaceId={workspace?.id || ''}
                  workspaceName={workspace?.name}
                />
              }
            />

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
