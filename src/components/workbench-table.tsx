'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

import { Link } from '@/components/link'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import { Card, CardContent, CardFooter } from '~/components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { App, AppInstance, User, Workbench, Workspace } from '~/domain/model'

import { WorkbenchDeleteForm } from './forms/workbench-delete-form'
import { WorkbenchUpdateForm } from './forms/workbench-update-form'
import { toast } from './hooks/use-toast'

const ActionCell = ({
  row,
  refreshWorkbenches,
  workspaces
}: {
  row: Row<Workbench>
  refreshWorkbenches: () => void
  workspaces: Workspace[] | undefined
}) => {
  const workbench = row.original
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
            toast({
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
            toast({
              title: 'Success!',
              description: `Session ${workbench?.name} in ${
                workspaces?.find((w) => w.id === workbench.workspaceId)?.name
              } was deleted`,
              variant: 'default'
            })
          }}
        />
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setOpen(true)
            // router.push(`/workspaces/${workbench?.workspaceId}/sessions/${workbench?.id}`)
          }}
          className="text-muted-foreground/60 hover:bg-muted/20 hover:text-muted-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive/60 hover:bg-destructive/20 hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}

export const columns = (
  apps: App[] | undefined,
  users: User[] | undefined,
  workspaces: Workspace[] | undefined,
  refreshWorkbenches: () => void,
  appInstances: AppInstance[] | undefined
): ColumnDef<Workbench>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Session
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const workbench = row.original
      return (
        <Link
          href={`/workspaces/${workbench?.workspaceId}/sessions/${workbench?.id}`}
          className="nav-link-base nav-link-hover [&.active]:nav-link-active"
        >
          {workbench?.name}
        </Link>
      )
    }
  },
  {
    id: 'workspace',
    header: 'Workspace',
    cell: ({ row }) => {
      const workbench = row.original
      const workspace = workspaces?.find((w) => w.id === workbench?.workspaceId)
      return workspace?.name || '-'
    }
  },
  {
    id: 'apps',
    header: 'Running Apps',
    cell: ({ row }) => {
      const workbench = row.original
      return (
        appInstances
          ?.filter(
            (instance) => workbench?.workspaceId === instance.workspaceId
          )
          ?.filter((instance) => workbench.id === instance.workbenchId)
          .map(
            (instance) =>
              apps?.find((app) => app.id === instance.appId)?.name || ''
          )
          .join(', ') || 'No app started'
      )
    }
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const workbench = row.original
      const user = users?.find((user) => user.id === workbench?.userId)
      return user ? `${user.firstName} ${user.lastName}` : '-'
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const workbench = row.original
      const date = workbench.createdAt
        ? new Date(workbench.createdAt)
        : new Date()
      return (
        <div title={date.toLocaleDateString()}>
          {formatDistanceToNow(date)} ago
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: (props) => (
      <ActionCell
        {...props}
        refreshWorkbenches={refreshWorkbenches}
        workspaces={workspaces}
      />
    )
  }
]

export default function WorkbenchTable({
  workbenches
}: {
  workbenches: Workbench[] | undefined
}) {
  const { apps, workspaces, refreshWorkbenches, appInstances } = useAppState()
  const [sorting, setSorting] = useState<SortingState>([])
  const data = workbenches

  const tableColumns = React.useMemo(
    () => columns(apps, [], workspaces, refreshWorkbenches, appInstances),
    [apps, workspaces, refreshWorkbenches, appInstances]
  )

  const table = useReactTable({
    data: data ?? [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  return (
    <div className="mb-4 grid flex-1 items-start gap-4">
      <div className="flex items-center justify-end">
        {/* <WorkbenchCreateForm workspaceId={workspaceId} /> */}
      </div>
      <Card
        variant="glass"
        className="flex h-full flex-col justify-between duration-300"
      >
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-background/80"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{data?.length}</strong> of{' '}
            <strong>{data?.length}</strong> sessions
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
