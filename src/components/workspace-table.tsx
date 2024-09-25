'use server'

import Link from 'next/link'
import { EllipsisVerticalIcon } from 'lucide-react'

import { workspaceList } from '@/components/actions/workspace-view-model'

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
import { Workspace } from '~/domain/model'

import { userMe } from './actions/user-view-model'
import { WorkspaceDeleteForm } from './forms/workspace-forms'

export default async function WorkspaceTable() {
  const response = await workspaceList()
  const user = await userMe()

  const TableHeads = () => (
    <>
      <TableHead>Name</TableHead>
      <TableHead>Short Name</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="hidden md:table-cell">Members</TableHead>
      <TableHead className="hidden md:table-cell">Created at</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workspace }: { workspace?: Workspace }) => (
    <TableRowComponent>
      <TableCell className="p-1 font-medium">
        <Link
          href={`/workspaces/${workspace?.id}`}
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          {workspace?.name}
        </Link>
      </TableCell>
      <TableCell className="p-1 font-medium">{workspace?.shortName}</TableCell>
      <TableCell className="font-xs p-1">{workspace?.description}</TableCell>
      <TableCell className="p-1">
        <Badge variant="outline">{workspace?.status}</Badge>
      </TableCell>
      <TableCell className="p-1 font-medium">
        {workspace?.memberIds?.toString()}
      </TableCell>
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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <WorkspaceDeleteForm id={workspace?.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRowComponent>
  )

  const workspaces = response?.data
  const error = response?.error

  return (
    <div className="mb-8 grid flex-1 items-start gap-4">
      <Card>
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
    </div>
  )
}
