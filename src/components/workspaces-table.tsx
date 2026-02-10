'use client'

import { EllipsisVerticalIcon, HomeIcon } from 'lucide-react'
import { PencilIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { User, WorkspaceWithDev } from '@/domain/model'
import { useInstanceTheme } from '@/hooks/use-instance-theme'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/card'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent
} from '~/components/ui/table'
import { getGradient } from '~/domain/utils/gradient'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from './forms/workspace-forms'
import { toast } from './hooks/use-toast'
export default function WorkspaceTable({
  workspaces,
  title,
  description,
  onUpdate
}: {
  workspaces: WorkspaceWithDev[] | undefined
  user: User | undefined
  title?: string
  description?: string
  onUpdate?: () => void
}) {
  const [deleted, setDeleted] = useState<boolean>(false)
  const [updated, setUpdated] = useState<boolean>(false)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const { can, PERMISSIONS } = useAuthorization()

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Workspace deleted',
        variant: 'default'
      })
    }
  }, [deleted])

  useEffect(() => {
    if (updated) {
      toast({
        title: 'Success!',
        description: 'Workspace updated',
        variant: 'default'
      })
    }
  }, [updated])

  const TableHeads = () => (
    <>
      <TableHead className="w-[50px]"></TableHead>
      <TableHead className="font-semibold text-foreground">Workspace</TableHead>
      <TableHead className="text-center font-semibold text-foreground">
        Owner
      </TableHead>
      <TableHead className="text-center font-semibold text-foreground">
        Members
      </TableHead>
      <TableHead className="text-center font-semibold text-foreground">
        Sessions
      </TableHead>
      {/* <TableHead className="font-semibold text-foreground">Files</TableHead> */}
      <TableHead className="font-semibold text-foreground">Created</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workspace }: { workspace?: WorkspaceWithDev }) => {
    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const instanceTheme = useInstanceTheme()

    const getCardGradient = (name: string) => {
      const currentTheme =
        resolvedTheme === 'dark' ? instanceTheme.dark : instanceTheme.light
      const primary = currentTheme.primary || 'hsl(var(--primary))'
      const secondary = currentTheme.secondary || 'hsl(var(--secondary))'

      return getGradient(name, primary, secondary)
    }

    return (
      <>
        {open && (
          <WorkspaceUpdateForm
            workspace={workspace}
            state={[open, setOpen]}
            onSuccess={() => {
              setUpdated(true)
              setTimeout(() => {
                setUpdated(false)
              }, 3000)

              if (onUpdate) onUpdate()
            }}
          />
        )}

        {deleteOpen && (
          <WorkspaceDeleteForm
            id={workspace?.id}
            state={[deleteOpen, setDeleteOpen]}
            onSuccess={() => {
              refreshWorkspaces()
              setDeleted(true)
              setTimeout(() => {
                setDeleted(false)
              }, 3000)
              if (onUpdate) onUpdate()
            }}
          />
        )}
        <TableRowComponent
          className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
          onClick={() => router.push(`/workspaces/${workspace?.id}`)}
        >
          <TableCell className="p-1">
            <div
              className="relative h-8 w-8 overflow-hidden rounded-md"
              style={{ background: getCardGradient(workspace?.name || '') }}
            >
              {workspace?.dev?.image && (
                <Image
                  src={workspace.dev.image}
                  alt={workspace?.name || ''}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </TableCell>
          <TableCell className="w-52 max-w-52 p-1 font-semibold">
            <div className="inline-flex gap-x-2">
              {workspace?.isMain && <HomeIcon className="h-4 w-4 text-muted" />}
              <span
                className={`text-wrap ${workspace?.isMain ? 'w-44 max-w-44' : 'w-48 max-w-48'}`}
              >
                {workspace?.name}
              </span>
            </div>
          </TableCell>
          <TableCell className="p-1 text-center">
            {workspace?.dev?.owner || workspace?.dev?.owner || '-'}
          </TableCell>
          <TableCell className="p-1 text-center">
            {workspace?.dev?.members
              ?.map((member) => `${member.firstName} ${member.lastName}`)
              ?.join(', ')}
          </TableCell>
          <TableCell className="p-1 text-center">
            {workspace?.dev?.workbenchCount || 0}
          </TableCell>
          {/* <TableCell className="p-1">
            {workspace?.files || 0}
          </TableCell> */}
          <TableCell className="p-1">
            {workspace?.createdAt
              ? new Date(workspace.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : '-'}
          </TableCell>
          <TableCell className="p-1" onClick={(e) => e.stopPropagation()}>
            {workspace?.id &&
              can(PERMISSIONS.updateWorkspace, {
                workspace: workspace?.id
              }) && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault()
                      setOpen(true)
                    }}
                    className="text-muted-foreground/60 hover:bg-muted/20 hover:text-muted-foreground"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive/60 hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      setDeleteOpen(true)
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
          </TableCell>
        </TableRowComponent>
      </>
    )
  }

  return (
    <>
      <Card
        variant="glass"
        className="flex h-full flex-col justify-between duration-300"
      >
        {title && (
          <CardHeader className="pb-4">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRowComponent>
                <TableHeads />
              </TableRowComponent>
            </TableHeader>
            <TableBody>
              {workspaces?.map((w) => (
                <TableRow key={`workspace-table-${w.id}`} workspace={w} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-foreground-muted text-xs">
            Showing <strong>1-{workspaces?.length}</strong> of{' '}
            <strong>{workspaces?.length}</strong>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
