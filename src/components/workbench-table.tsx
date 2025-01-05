'use client'

// https://ui.shadcn.com/docs/components/data-table

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, MonitorPlay, PlusIcon } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'

import { Button } from '~/components/button'
import { Badge } from '~/components/ui/badge'
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

import {
  WorkbenchCreateForm,
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'

export default function WorkbenchTable({
  workspaceId,
  onUpdate
}: {
  workspaceId: string
  onUpdate?: (id: string) => void
}) {
  const { workbenches, refreshWorkbenches, background, setBackground } =
    useAppState()
  const [deleted, setDeleted] = useState<boolean>(false)
  const { toast } = useToast()

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Success!',
        description: 'Desktop deleted',
        className: 'bg-background text-white',
        duration: 1000
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

  const TableRow = ({ workbench, title, description }: { workbench?: Workbench, title?: string, description?: string }) => {
    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const link = `/workspaces/${workbench?.workspaceId}/desktops/${workbench?.id}`

    return (
      <>
        {workbench && (
          <WorkbenchUpdateForm
            workbench={workbench}
            state={[open, setOpen]}
            onUpdate={() => {
              refreshWorkbenches()
              toast({
                title: 'Success!',
                description: 'Desktop updated successfully',
                className: 'bg-background text-white',
                duration: 1000
              })
            }}
          />
        )}

        <WorkbenchDeleteForm
          id={workbench?.id}
          state={[deleteOpen, setDeleteOpen]}
          onUpdate={() => {
            setDeleted(true)
            setTimeout(() => {
              setDeleted(false)
            }, 3000)
            refreshWorkbenches()
          }}
        />

        <TableRowComponent className="cursor-pointer bg-background/40 transition-colors hover:border-accent hover:bg-background/80">
          <TableCell className="p-1" align="center">
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  variant="ghost"
                  className="text-muted ring-0"
                >
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

  const CardContainer = ({ workbenches, title, description }: { workbenches?: Workbench[], title?: string, description?: string }) => (
    <Card className="flex h-full flex-col justify-between rounded-2xl border-secondary bg-background/40 text-white duration-300">
      {title && <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent className="cursor-pointer transition-colors hover:border-accent hover:bg-background/80">
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
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <WorkbenchCreateForm
            workspaceId={workspaceId}
            onUpdate={(workbenchId) => {
              refreshWorkbenches()
              toast({
                title: 'Success!',
                description: 'Desktop created successfully',
                className: 'bg-background text-white',
                duration: 1000
              })
              setBackground({ workbenchId, workspaceId })
              if (onUpdate) onUpdate(workbenchId)
            }}
          />
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
