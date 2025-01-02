'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon } from 'lucide-react'

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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Workbench, Workspace } from '@/domain/model'

import { toast } from '~/hooks/use-toast'

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

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Workspace deleted',
        className: 'bg-background text-white'
      })
    }
  }, [deleted])

  useEffect(() => {
    if (updated) {
      toast({
        title: 'Success!',
        description: 'Workspace updated',
        className: 'bg-background text-white'
      })
    }
  }, [updated])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" id="grid">
      {workspaces?.map((workspace) => (
        <div key={workspace.id} className="group relative">
          <div className="absolute right-4 top-4 z-10">
            <DropdownMenu>
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
            <Card className="flex h-full flex-col justify-between rounded-2xl border-secondary bg-background/40 text-white transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg">
              <CardHeader>
                <CardTitle>{workspace.shortName}</CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {
                    workbenches?.filter((w) => w.workspaceId === workspace.id)
                      ?.length
                  }{' '}
                  desktops running
                </p>
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
