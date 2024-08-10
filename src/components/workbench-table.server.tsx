import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { workbenchList } from '~/app/workbench-view-model.server'
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

import { Icons } from './ui/icons'
import {
  CreateWorkbenchAction,
  DropdownMenuActions
} from './workbench-actions.client'

import placeholder from '/public/placeholder.svg'

export default async function WorkbenchList() {
  let workbenches = await workbenchList()

  const TableHeads = () => (
    <>
      <TableHead className="hidden w-[100px] sm:table-cell">
        <span className="sr-only">Image</span>
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="hidden md:table-cell">Workspace</TableHead>
      <TableHead className="hidden md:table-cell">Created at</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workbench }: { workbench?: Workbench }) => (
    <TableRowComponent
    // onClick={() => handleWorkbenchClicked(app?.id)}
    >
      <TableCell className="hidden p-1 sm:table-cell">
        <Link
          href={`/workspaces/${workbench?.workspaceId}/workbenches/${workbench?.id}`}
        >
          <Image
            src={placeholder}
            alt={workbench?.name || 'App image'}
            width="48"
            height="48"
            className="aspect-square rounded-md object-cover"
          />
        </Link>
      </TableCell>
      <TableCell className="p-1 font-medium">{workbench?.name}</TableCell>
      <TableCell className="p-1">
        <Badge variant="outline">{workbench?.status}</Badge>
      </TableCell>
      <TableCell className="p-1 font-medium">
        {workbench?.workspaceId}
      </TableCell>
      <TableCell className="hidden p-1 md:table-cell">
        {workbench?.createdAt.toLocaleDateString()}
      </TableCell>
      <TableCell className="p-1">
        <DropdownMenuActions id={workbench?.id} />
      </TableCell>
    </TableRowComponent>
  )

  const CardContainer = ({ workbenches }: { workbenches?: Workbench[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>Apps</CardTitle>
        <CardDescription>Your running apps</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<p>Loading feed...</p>}>
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
        </Suspense>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> apps
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="mb-8 grid flex-1 items-start gap-4 pr-8 md:gap-8">
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

            <CreateWorkbenchAction />
          </div>
        </div>
        <TabsContent value="all">
          <CardContainer workbenches={workbenches.data} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workbenches={workbenches?.data?.filter(
              (a) => a.status === 'active'
            )}
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workbenches={workbenches?.data?.filter(
              (a) => a.status !== 'active'
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
