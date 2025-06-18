'use client'

import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import React from 'react'

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

import {
  WorkbenchCreateForm,
  WorkbenchDeleteForm,
  WorkbenchUpdateForm
} from './forms/workbench-forms'
import { useAppState } from './store/app-state-context'

export default function WorkbenchTable({
  workspaceId,
  title,
  description
}: {
  workspaceId: string
  title?: string
  description?: string
  onUpdate?: (id: string) => void
}) {
  const { workbenches, refreshWorkbenches, appInstances, apps, workspaces } =
    useAppState()
  const { setNotification } = useAppState()

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

  const TableHeads = () => (
    <>
      {/* <TableHead className="text-white">
        <span className="sr-only">Session</span>
      </TableHead> */}
      <TableHead className="text-white">Session</TableHead>
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

    return (
      <>
        {workbench && open && (
          <WorkbenchUpdateForm
            workbench={workbench}
            state={[open, setOpen]}
            onSuccess={() => {
              refreshWorkbenches()
              setNotification({
                title: 'Success!',
                description: 'Session updated successfully'
              })
            }}
          />
        )}

        {deleteOpen && (
          <WorkbenchDeleteForm
            id={workbench?.id}
            state={[deleteOpen, setDeleteOpen]}
            onSuccess={() => {
              setTimeout(() => {
                refreshWorkbenches()
              }, 2000)
              setNotification({
                title: 'Success!',
                description: `Session ${workbench?.name} in ${
                  workspaces?.find((w) => w.id === workspaceId)?.name
                } was deleted`,
                variant: 'default'
              })
            }}
          />
        )}

        <TableRowComponent className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
          {/* <TableCell className="p-1" align="center">
            <MonitorPlay className="h-4 w-4" />
          </TableCell> */}
          <TableCell className="p-1 font-semibold">
            <Link
              href={`/workspaces/${workbench?.workspaceId}/sessions/${workbench?.id}`}
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
                  <React.Fragment key={`app-instance-${instance.id}`}>
                    {appName}
                    {!isLast && ', '}
                  </React.Fragment>
                )
              })}
          </TableCell>
          <TableCell
            className="hidden p-1 md:table-cell"
            title={workbench?.createdAt?.toLocaleDateString()}
          >
            {workbench && formatDistanceToNow(workbench?.createdAt ?? new Date())} ago
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
                {/* <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(true)
                  }}
                >
                  Edit
                </DropdownMenuItem> */}
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
        <CardHeader className="pb-4">
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
        <div className="text-xs text-muted">
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
          // onSuccess={(sessionId) => {
          //   refreshWorkbenches()
          //   setNotification({
          //     title: 'Success!',
          //     description: 'Session created successfully'
          //   })
          //   setBackground({ sessionId, workspaceId })
          //   if (onUpdate) onUpdate(sessionId)
          // }}
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
