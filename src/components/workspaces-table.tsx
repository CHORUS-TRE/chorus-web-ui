'use client'

import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, HomeIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Link } from '@/components/link'
import { User, Workspace } from '@/domain/model'
import { useAppState } from '@/providers/app-state-provider'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent
} from '~/components/ui/table'

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
  workspaces: Workspace[] | undefined
  user: User | undefined
  title?: string
  description?: string
  onUpdate?: () => void
}) {
  const [deleted, setDeleted] = useState<boolean>(false)
  const [updated, setUpdated] = useState<boolean>(false)
  const { refreshWorkspaces } = useAppState()

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
      <TableHead className="font-semibold text-foreground">Name</TableHead>
      {/* <TableHead className="font-semibold text-foreground">Short Name</TableHead> */}
      <TableHead className="font-semibold text-foreground">
        Description
      </TableHead>
      <TableHead className="font-semibold text-foreground">Status</TableHead>
      {/* <TableHead className="hidden md:table-cell">Members</TableHead> */}
      <TableHead className="hidden font-semibold text-foreground md:table-cell">
        Created
      </TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workspace }: { workspace?: Workspace }) => {
    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
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
        <TableRowComponent className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
          <TableCell className="w-52 max-w-52 p-1 font-semibold">
            <Link
              href={`/workspaces/${workspace?.id}`}
              className="nav-link-base nav-link-hover [&.active]:nav-link-active inline-flex gap-x-2"
            >
              {workspace?.isMain && <HomeIcon className="h-4 w-4 text-muted" />}
              <span
                className={`text-wrap ${workspace?.isMain ? 'w-44 max-w-44' : 'w-48 max-w-48'}`}
              >
                {workspace?.name}
              </span>
            </Link>
          </TableCell>
          <TableCell className="font-xs p-1">
            {workspace?.description}
          </TableCell>
          <TableCell className="p-1">
            {workspace?.status && (
              <Badge variant="outline">{workspace?.status}</Badge>
            )}
          </TableCell>

          <TableCell className="hidden p-1 md:table-cell">
            {formatDistanceToNow(workspace?.createdAt || new Date())} ago
          </TableCell>
          <TableCell className="p-1">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" variant="ghost">
                  <EllipsisVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-elevated">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(true)
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="text-xs text-muted">
            Showing <strong>1-{workspaces?.length}</strong> of{' '}
            <strong>{workspaces?.length}</strong>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
