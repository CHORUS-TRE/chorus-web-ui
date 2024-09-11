'use server'

import Image from 'next/image'
import Link from 'next/link'
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

import { workspaceGet } from './actions/workspace-view-model'
import {
  WorkbenchCreateForm,
  WorksbenchDeleteForm
} from './forms/workbench-forms'
import { Icons } from './ui/icons'
import Dialog from './dialog'

import placeholder from '/public/placeholder.svg'

export default async function WorkbenchList() {
  const workbenches = await workbenchList()
  const responses =
    workbenches?.data &&
    (await Promise.all(
      workbenches.data.map((w) => workspaceGet(w.workspaceId))
    ))
  const workspaces = responses?.map((w) => w.data)

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

  const TableRow = ({ workbench }: { workbench?: Workbench }) => {
    const link = `/workspaces/${workbench?.workspaceId}/${workbench?.id}`

    return (
      <TableRowComponent>
        <TableCell className="hidden p-1 sm:table-cell">
          <Link href={link}>
            <Image
              src={placeholder}
              alt={workbench?.name || 'App image'}
              width="48"
              height="48"
              className="aspect-square rounded-md object-cover"
            />
          </Link>
        </TableCell>
        <TableCell className="p-1 font-medium">
          <Link href={link}>{workbench?.shortName}</Link>
        </TableCell>
        <TableCell className="p-1">
          <Badge variant="outline">{workbench?.status}</Badge>
        </TableCell>
        <TableCell className="p-1 font-medium">
          <Link href={link}>
            {
              workspaces?.find((w) => w?.id === workbench?.workspaceId)
                ?.shortName
            }
          </Link>
        </TableCell>
        <TableCell className="hidden p-1 md:table-cell">
          {workbench?.createdAt.toLocaleDateString()}
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
    <Card className="border-0 border-r-0 bg-white">
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

            <Dialog triggerText="New app">
              <WorkbenchCreateForm />
            </Dialog>
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
