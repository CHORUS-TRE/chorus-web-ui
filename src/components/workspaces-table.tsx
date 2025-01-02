'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EllipsisVerticalIcon } from 'lucide-react'

import { User, Workspace } from '@/domain/model'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useToast } from '~/hooks/use-toast'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from './forms/workspace-forms'

export default function WorkspaceTable({
  workspaces,
  user,
  onUpdate
}: {
  workspaces: Workspace[] | undefined
  user: User | undefined
  onUpdate?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [deleted, setDeleted] = useState<boolean>(false)
  const [updated, setUpdated] = useState<boolean>(false)
  const { toast } = useToast()

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

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error!',
        description: error,
        variant: 'destructive',
        className: 'bg-background text-white'
      })
    }
  }, [error])

  const TableHeads = () => (
    <>
      <TableHead className="font-semibold text-white">Name</TableHead>
      <TableHead className="font-semibold text-white">Short Name</TableHead>
      <TableHead className="font-semibold text-white">Description</TableHead>
      <TableHead className="font-semibold text-white">Status</TableHead>
      {/* <TableHead className="hidden md:table-cell">Members</TableHead> */}
      <TableHead className="hidden md:table-cell">Created at</TableHead>
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
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[open, setOpen]}
          onUpdate={() => {
            setUpdated(true)
            setTimeout(() => {
              setUpdated(false)
            }, 3000)

            if (onUpdate) onUpdate()
          }}
        />

        <WorkspaceDeleteForm
          id={workspace?.id}
          state={[deleteOpen, setDeleteOpen]}
          onUpdate={() => {
            setDeleted(true)
            setTimeout(() => {
              setDeleted(false)
            }, 3000)
            if (onUpdate) onUpdate()
          }}
        />
        <TableRowComponent className="cursor-pointer bg-background/40 transition-colors hover:border-accent hover:bg-background/80">
          <TableCell className="p-1 font-medium">
            <Link href={`/workspaces/${workspace?.id}`}>{workspace?.name}</Link>
          </TableCell>
          <TableCell className="p-1 font-medium">
            <Link href={`/workspaces/${workspace?.id}`}>
              {workspace?.shortName}
            </Link>
          </TableCell>
          <TableCell className="font-xs p-1">
            <Link href={`/workspaces/${workspace?.id}`}>
              {workspace?.description}
            </Link>
          </TableCell>
          <TableCell className="p-1">
            <Link href={`/workspaces/${workspace?.id}`}>
              <Badge variant="outline">{workspace?.status}</Badge>
            </Link>
          </TableCell>
          <TableCell className="hidden p-1 md:table-cell">
            <Link href={`/workspaces/${workspace?.id}`}>
              {workspace?.createdAt.toLocaleDateString()}
            </Link>
          </TableCell>
          <TableCell className="p-1">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <EllipsisVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white">
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
      <Card className="flex h-full flex-col justify-between rounded-2xl border-secondary bg-background/40 text-white duration-300">
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRowComponent>
                <TableHeads />
              </TableRowComponent>
            </TableHeader>
            <TableBody>
              {workspaces?.map((w) => <TableRow key={w.id} workspace={w} />)}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{workspaces?.length}</strong> of{' '}
            <strong>{workspaces?.length}</strong>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
