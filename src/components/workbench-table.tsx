'use client'

// https://ui.shadcn.com/docs/components/data-table

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, MonitorPlay } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Workbench } from '~/domain/model'
import { useToast } from '~/hooks/use-toast'

import { WorkbenchDeleteForm } from './forms/workbench-forms'

export default function WorkbenchTable({
  workspaceId,
  onUpdate
}: {
  workspaceId: string
  onUpdate?: () => void
}) {
  const { workbenches, refreshWorkbenches } = useAppState()
  const [deleted, setDeleted] = useState<boolean>(false)
  const { toast } = useToast()

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Workbench deleted',
        className: 'bg-background text-white'
      })
    }
  }, [deleted])

  const TableHeads = () => (
    <>
      <TableHead>
        <span className="sr-only">Desktop</span>
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead className="hidden md:table-cell">Created</TableHead>

      <TableHead>Status</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workbench }: { workbench?: Workbench }) => {
    const [open, setOpen] = useState(false)
    const link = `/workspaces/${workbench?.workspaceId}/desktops/${workbench?.id}`

    return (
      <TableRowComponent className="cursor-pointer bg-background/40 transition-colors hover:border-accent hover:bg-background/80">
        <TableCell className="p-1">
          {' '}
          <MonitorPlay className="h-3.5 w-3.5" />
        </TableCell>
        <TableCell className="p-1 font-medium">
          <Link
            href={link}
            className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
          >
            {workbench?.shortName}
          </Link>
        </TableCell>

        <TableCell
          className="hidden p-1 md:table-cell"
          title={workbench?.createdAt.toLocaleDateString()}
        >
          {workbench && formatDistanceToNow(workbench?.createdAt)} ago
        </TableCell>
        <TableCell className="p-1">
          <Badge variant="outline">{workbench?.status}</Badge>
        </TableCell>
        <TableCell className="p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem>
                <WorkbenchDeleteForm
                  id={workbench?.id}
                  state={[open, setOpen]}
                  onUpdate={() => {
                    setDeleted(true)
                    toast({
                      title: 'Success!',
                      description: 'Desktop deleted',
                      className: 'bg-background text-white'
                    })

                    if (background?.workbenchId === workbench?.id)
                      setBackground(undefined)
                    if (onUpdate) onUpdate()

                    list()
                  }}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRowComponent>
    )
  }

  const CardContainer = ({ workbenches }: { workbenches?: Workbench[] }) => (
    <Card className="flex h-full flex-col justify-between rounded-2xl border-secondary bg-background/40 text-white duration-300">
      <CardHeader>
        <CardTitle>Desktops</CardTitle>
        <CardDescription>Your running desktops</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent className="cursor-pointer bg-background/40 transition-colors hover:border-accent hover:bg-background/80">
              {' '}
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
          Showing <strong>1-{workbenches?.length}</strong> of{' '}
          <strong>{workbenches?.length}</strong> apps
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
        </div>
        <TabsContent value="all">
          <CardContainer workbenches={filteredWorkbenches} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workbenches={filteredWorkbenches?.filter(
              (a) => a.status === 'active'
            )}
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workbenches={filteredWorkbenches?.filter(
              (a) => a.status !== 'active'
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
