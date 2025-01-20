'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, EllipsisVerticalIcon } from 'lucide-react'

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
import { Workbench } from '~/domain/model'
import { useToast } from '~/hooks/use-toast'

import {
  WorkbenchCreateForm,
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import { useAuth } from './store/auth-context'

export default function WorkbenchTable({
  workspaceId,
  title,
  description,
  onUpdate
}: {
  workspaceId: string
  title?: string
  description?: string
  onUpdate?: (id: string) => void
}) {
  const {
    workbenches,
    refreshWorkbenches,
    background,
    setBackground,
    appInstances,
    apps
  } = useAppState()
  const { user } = useAuth()
  const [deleted, setDeleted] = useState<boolean>(false)
  const { toast } = useToast()

  const filteredWorkbenches =
    workspaceId === user?.workspaceId
      ? workbenches
      : workbenches?.filter((w) => w.workspaceId === workspaceId)

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
      {/* <TableHead className="text-white">
        <span className="sr-only">Desktop</span>
      </TableHead> */}
      <TableHead className="text-white">Desktop</TableHead>
      <TableHead className="text-white">Running Apps</TableHead>
      <TableHead className="hidden text-white md:table-cell">Created</TableHead>

      <TableHead className="text-white">Status</TableHead>
      <TableHead className="text-white" colSpan={2}>
        <span className="text-white">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workbench }: { workbench?: Workbench }) => {
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

        <TableRowComponent className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
          {/* <TableCell className="p-1" align="center">
            <MonitorPlay className="h-4 w-4" />
          </TableCell> */}
          <TableCell className="p-1 font-semibold">
            <Link
              href={`/workspaces/${workbench?.workspaceId}/desktops/${workbench?.id}`}
              className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
            >
              {workbench?.shortName}
            </Link>
          </TableCell>
          <TableCell className="hidden p-1 md:table-cell">
            {appInstances
              ?.filter((instance) => workbench?.id === instance.workbenchId)
              .map((instance, index, array) => {
                const appName =
                  apps?.find((app) => app.id === instance.appId)?.name || ''
                const isLast = index === array.length - 1

                return (
                  <>
                    {appName}
                    {!isLast && ', '}
                  </>
                )
              })}
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
          <TableCell className="p-1"></TableCell>
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

  const CardContainer = ({
    workbenches,
    title,
    description
  }: {
    workbenches?: Workbench[]
    title?: string
    description?: string
  }) => (
    <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 text-white duration-300">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent className="hover:bg-background/80">
              <TableHeads />
            </TableRowComponent>
          </TableHeader>
          <TableBody>
            {workbenches?.map((w) => (
              <TableRow key={`workbench-table-${w.id}`} workbench={w} />
            ))}
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
      <div className="flex items-center justify-end">
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
      <CardContainer
        workbenches={filteredWorkbenches}
        title={title}
        description={description}
      />
    </div>
  )
}
