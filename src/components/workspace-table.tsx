'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { EllipsisVerticalIcon } from 'lucide-react'

import { workspaceList } from '@/components/actions/workspace-view-model'
import { User, Workspace } from '@/domain/model'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
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
import { useToast } from '~/hooks/use-toast'

import { userMe } from './actions/user-view-model'
import { WorkspaceDeleteForm } from './forms/workspace-forms'
import { WorkspaceUpdateForm } from './forms/workspace-forms'
import { useNavigation } from './store/navigation-context'

export default function WorkspaceTable({
  onUpdate
}: {
  onUpdate?: () => void
}) {
  const [user, setUser] = useState<User | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleted, setDeleted] = useState<boolean>(false)
  const [updated, setUpdated] = useState<boolean>(false)
  const { toast } = useToast()

  const refreshWorkspaces = useCallback(() => {
    workspaceList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspaces(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  useEffect(() => {
    try {
      refreshWorkspaces()

      userMe().then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setUser(response.data)
      })
    } catch (error) {
      setError(error.message)
    }
  }, [])

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

            refreshWorkspaces()
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
            refreshWorkspaces()
          }}
        />
        <Link href={`/workspaces/${workspace?.id}`} legacyBehavior>
          <TableRowComponent className="cursor-pointer bg-background/40 transition-colors hover:border-accent hover:bg-background/80">
            <TableCell className="p-1 font-medium">{workspace?.name}</TableCell>
            <TableCell className="p-1 font-medium">
              {workspace?.shortName}
            </TableCell>
            <TableCell className="font-xs p-1">
              {workspace?.description}
            </TableCell>
            <TableCell className="p-1">
              <Badge variant="outline">{workspace?.status}</Badge>
            </TableCell>
            {/* <TableCell className="p-1 font-medium">
          {workspace?.memberIds?.toString()}
        </TableCell> */}
            <TableCell className="hidden p-1 md:table-cell">
              {workspace?.createdAt.toLocaleDateString()}
            </TableCell>
            <TableCell className="p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-black text-white"
                >
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
        </Link>
      </>
    )
  }

  return (
    <>
      <Card className="flex h-full flex-col justify-between rounded-2xl border-none bg-background/40 text-white duration-300">
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
