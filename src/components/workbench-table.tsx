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
import { ArrowUpDown, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'

import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAppState } from '@/stores/app-state-store'
import { listUsers } from '@/view-model/user-view-model'
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
import { WorkbenchServerPodStatus } from '~/domain/model'
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
const WorkbenchK8sStatusBadge = ({
  workbench
}: {
  workbench: Workbench
  refreshKey?: number
}) => {
  const currentStatus = workbench.serverPodStatus

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-mono text-[10px] uppercase',
        currentStatus === WorkbenchServerPodStatus.READY
          ? 'border-green-500/20 bg-green-500/10 text-green-500'
          : currentStatus === WorkbenchServerPodStatus.FAILED
            ? 'border-red-500/20 bg-red-500/10 text-red-500'
            : 'border-muted bg-muted/20 text-muted-foreground'
      )}
    >
      {currentStatus || 'Unknown'}
    </Badge>
  )
}

const WorkbenchK8sMessage = ({
  workbench
}: {
  workbench: Workbench
  refreshKey?: number
}) => {
  const currentMessage = workbench.serverPodMessage

  return (
    <div
      className="max-w-[200px] truncate text-xs text-muted-foreground"
      title={currentMessage}
    >
      {currentMessage || '-'}
    </div>
  )
}

export const columns = (
  apps: App[] | undefined,
  users: User[] | undefined,
  workspaces: Workspace[] | undefined,
  refreshWorkbenches: () => void,
  appInstances: AppInstance[] | undefined,
  refreshKey?: number
): ColumnDef<Workbench>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div
        className="max-w-[100px] truncate font-mono text-xs"
        title={row.original.id}
      >
        {row.original.id}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-accent/60 hover:text-accent"
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
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const workbench = row.original
      const workbenchUsers = users?.filter((user) =>
        user.rolesWithContext?.some(
          (role) => role.context.workbench === workbench.id
        )
      )
      return (
        <div className="text-xs">
          {workbenchUsers && workbenchUsers.length > 0
            ? workbenchUsers
                .map((u) => `${u.firstName} ${u.lastName}`)
                .join(', ')
            : '-'}
        </div>
      )
    }
  },
  {
    id: 'apps',
    header: 'Apps',
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
    id: 'k8sStatus',
    header: () => (
      <div className="text-foreground-muted text-center">Status</div>
    ),
    cell: ({ row }) => {
      const workbench = row.original
      return (
        <div className="text-center">
          <WorkbenchK8sStatusBadge
            key={`${workbench.id}-status-${refreshKey}`}
            workbench={workbench}
            refreshKey={refreshKey}
          />
        </div>
      )
    }
  },
  {
    id: 'k8sMessage',
    header: 'Message',
    cell: ({ row }) => {
      const workbench = row.original
      return (
        <WorkbenchK8sMessage
          key={`${workbench.id}-msg-${refreshKey}`}
          workbench={workbench}
          refreshKey={refreshKey}
        />
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-accent/60 hover:text-accent"
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
  workbenches,
  refreshKey
}: {
  workbenches: Workbench[] | undefined
  refreshKey?: number
}) {
  const { apps, workspaces, refreshWorkbenches, appInstances } = useAppState()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const loadAllUsers = useCallback(async () => {
    if (!workbenches || workbenches.length === 0) {
      setUsers([])
      return
    }

    setLoadingUsers(true)
    const workbenchIds =
      workbenches?.map((wb) => wb.id).filter((id): id is string => !!id) || []
    try {
      const result = await listUsers({ filterWorkbenchIDs: workbenchIds })
      if (result.data) {
        setUsers(result.data as User[])
      }
    } catch (error) {
      console.error('Failed to load workspace members', error)
    } finally {
      setLoadingUsers(false)
    }
  }, [workbenches])

  useEffect(() => {
    loadAllUsers()
  }, [loadAllUsers, refreshKey])

  const [sorting, setSorting] = useState<SortingState>([])
  const data = workbenches

  const tableColumns = React.useMemo(
    () =>
      columns(
        apps,
        users,
        workspaces,
        refreshWorkbenches,
        appInstances,
        refreshKey
      ),
    [apps, users, workspaces, refreshWorkbenches, appInstances, refreshKey]
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
      <div className="flex items-center justify-end"></div>
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
