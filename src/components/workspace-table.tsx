'use server'

import Link from 'next/link'
import { EllipsisVerticalIcon } from 'lucide-react'

import { workspaceList } from '@/components/actions/workspace-view-model'

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Workspace } from '~/domain/model'

import { userMe } from './actions/user-view-model'
import {
  WorkspaceCreateForm,
  WorkspaceDeleteForm
} from './forms/workspace-forms'
import { Icons } from './ui/icons'

export default async function WorkspaceTable() {
  const workspaces = await workspaceList()
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

  const CardContainer = ({ workspaces }: { workspaces?: Workspace[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>Your collaborative workspaces</CardDescription>
      </CardHeader>
      <CardContent>
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
  )

  return (
    <div className="mb-8 grid flex-1 items-start gap-4 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Icons.ListFilterIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <WorkspaceCreateForm userId={user.data?.id} />
          </div>
        </div>
        <TabsContent value="all">
          <CardContainer workspaces={workspaces?.data} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workspaces={
              workspaces?.data?.filter((a) => a.status === 'active') ?? []
            }
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workspaces={workspaces?.data?.filter((a) => a.status !== 'active')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
