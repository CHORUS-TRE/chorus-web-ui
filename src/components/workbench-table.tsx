'use server'

import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon } from 'lucide-react'

import { workbenchList } from '@/components/actions/workbench-view-model'

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
import { Workbench } from '~/domain/model'

import { WorksbenchDeleteForm } from './forms/workbench-forms'
import { Icons } from './ui/icons'

import placeholder from '/public/placeholder.svg'

export default async function WorkbenchTable({
  workspaceId
}: {
  workspaceId: string
}) {
  const workbenches = await workbenchList()
  const nextWorkbenches = workbenches?.data?.filter(
    (w) => w.workspaceId === workspaceId
  )

  const TableHeads = () => (
    <>
      {/* <TableHead className="hidden w-[100px] sm:table-cell">
        <span className="sr-only">Image</span>
      </TableHead> */}
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      {/* <TableHead className="hidden md:table-cell">Workspace</TableHead> */}
      <TableHead className="hidden md:table-cell">Created at</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workbench }: { workbench?: Workbench }) => {
    const link = `/workspaces/${workbench?.workspaceId}/${workbench?.id}`

    return (
      <TableRowComponent>
        {/* <TableCell className="hidden p-1 sm:table-cell">
          <Link href={link}>
            <Image
              src={placeholder}
              alt={workbench?.name || 'App image'}
              width="48"
              height="48"
              className="aspect-square rounded-md object-cover"
            />
          </Link>
        </TableCell> */}
        <TableCell className="p-1 font-medium">
          <Link
            href={link}
            className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
          >
            {workbench?.shortName}
          </Link>
        </TableCell>
        <TableCell className="p-1">
          <Badge variant="outline">{workbench?.status}</Badge>
        </TableCell>
        {/* <TableCell className="p-1 font-medium">
            {
              workspaces?.find((w) => w?.id === workbench?.workspaceId)
                ?.shortName
            }
        </TableCell> */}
        <TableCell
          className="hidden p-1 md:table-cell"
          title={workbench?.createdAt.toLocaleDateString()}
        >
          {workbench && formatDistanceToNow(workbench?.createdAt)} ago
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
                <WorksbenchDeleteForm id={workbench?.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRowComponent>
    )
  }

  const CardContainer = ({ workbenches }: { workbenches?: Workbench[] }) => (
    <Card className="border-0 border-r-0 bg-background text-white">
      <CardHeader>
        <CardTitle>Apps</CardTitle>
        <CardDescription>Your running apps</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent>
              <TableHeads />
            </TableRowComponent>
          </TableHeader>
          <TableBody>
            {workbenches?.map((w) => <TableRow key={w.id} workbench={w} />)}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> apps
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="mb-4 grid flex-1 items-start gap-4">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          {/* <div className="ml-auto flex items-center gap-2">
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
          </div> */}
        </div>
        <TabsContent value="all">
          <CardContainer workbenches={nextWorkbenches} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workbenches={nextWorkbenches?.filter((a) => a.status === 'active')}
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workbenches={nextWorkbenches?.filter((a) => a.status !== 'active')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
