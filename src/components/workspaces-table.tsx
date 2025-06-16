'use client'

import { EllipsisVerticalIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { User, Workspace } from '@/domain/model'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
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
import { useAppState } from './store/app-state-context'

export default function WorkspaceTable({
  workspaces,
  title,
  description,
  user,
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
  const { setNotification, refreshWorkspaces } = useAppState()

  useEffect(() => {
    if (deleted) {
      setNotification({
        title: 'Success!',
        description: 'Workspace deleted',
        variant: 'default'
      })
    }
  }, [deleted, setNotification])

  useEffect(() => {
    if (updated) {
      setNotification({
        title: 'Success!',
        description: 'Workspace updated',
        variant: 'default'
      })
    }
  }, [updated, setNotification])

  const TableHeads = () => (
    <>
      <TableHead className="font-semibold text-white">Name</TableHead>
      <TableHead className="font-semibold text-white">Short Name</TableHead>
      <TableHead className="font-semibold text-white">Description</TableHead>
      <TableHead className="font-semibold text-white">Status</TableHead>
      {/* <TableHead className="hidden md:table-cell">Members</TableHead> */}
      <TableHead className="hidden font-semibold text-white md:table-cell">
        Created at
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
            onUpdate={() => {
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
            onUpdate={() => {
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
          <TableCell className="p-1 font-semibold">
            <Link
              href={`/workspaces/${workspace?.id}`}
              className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
            >
              {workspace?.shortName}
            </Link>
          </TableCell>
          <TableCell className="p-1 font-normal">
            {workspace?.id === user?.workspaceId
              ? 'My Workspace'
              : workspace?.name}
          </TableCell>
          <TableCell className="font-xs p-1">
            {workspace?.description}
          </TableCell>
          <TableCell className="p-1">
            <Badge variant="outline">{workspace?.status}</Badge>
          </TableCell>
          <TableCell className="hidden p-1 md:table-cell">
            {workspace?.createdAt.toLocaleDateString()}
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
      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 text-white duration-300">
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
