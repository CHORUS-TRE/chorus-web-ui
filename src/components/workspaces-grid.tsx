'use client'
import { formatDistanceToNow } from 'date-fns'
import { HomeIcon, Package } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/card'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { Link } from '@/components/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { User, Workbench, Workspace } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
import { Badge } from '~/components/ui/badge'
import { getGradient } from '~/domain/utils/gradient'

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
      variant="flex"
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

  const { refreshWorkspaces, workbenches, customTheme } = useAppState()
  const { resolvedTheme } = useTheme()

  const getCardGradient = (name: string) => {
    const currentTheme =
      resolvedTheme === 'dark' ? customTheme.dark : customTheme.light
    const primary = currentTheme.primary || 'hsl(var(--primary))'
    const secondary = currentTheme.secondary || 'hsl(var(--secondary))'

    return getGradient(name, primary, secondary)
  }

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
                  <DropdownMenuContent align="end" className="glass-elevated">
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

            <Card className="flex h-full flex-col overflow-hidden">
              <Link
                href={`/workspaces/${workspace.id}`}
                variant="flex"
                title={workspace?.name}
              >
                <div
                  className="relative h-32 w-full bg-muted/20"
                  style={{ background: getCardGradient(workspace.name) }}
                >
                  {workspace.image && (
                    <Image
                      src={workspace.image}
                      alt={workspace.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </Link>
              <CardHeader className="mb-0 h-24 w-full">
                <CardTitle className="mb-1 flex items-center gap-3">
                  {workspace.isMain && (
                    <HomeIcon className="h-6 w-6 flex-shrink-0 text-muted" />
                  )}
                  {!workspace.isMain && (
                    <Package className="h-6 w-6 flex-shrink-0 text-muted" />
                  )}
                  <Link
                    href={`/workspaces/${workspace.id}`}
                    variant="flex"
                    title={workspace?.name}
                    className="min-w-0 flex-1 truncate text-nowrap"
                  >
                    {workspace?.name}
                  </Link>
                  {workspace.tag && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {workspace.tag}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
                  <span className="text-xs">PI: {workspace?.PI || '-'}</span>
                  <span className="block text-xs">
                    Created {formatDistanceToNow(workspace.createdAt)} ago{' '}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="">
                  <div className="mb-1 text-xs font-bold text-muted-foreground">
                    {(() => {
                      const count =
                        workbenches?.filter(
                          (w) => w.workspaceId === workspace.id
                        ).length || 0
                      return `${count} active session${count !== 1 ? 's' : ''}`
                    })()}
                  </div>
                  <ScrollArea
                    className="flex max-h-16 flex-col overflow-y-scroll"
                    type="hover"
                  >
                    <WorkspaceWorkbenchList workspaceId={workspace.id} />
                  </ScrollArea>
                </div>
              </CardContent>
              <div className="flex-grow" />
              <CardFooter className="flex items-end justify-start">
                <WorkbenchCreateForm
                  workspaceId={workspace?.id || ''}
                  workspaceName={workspace?.name}
                />
              </CardFooter>
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
