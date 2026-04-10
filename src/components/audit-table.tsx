'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Search
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { AuditEntry } from '@/domain/model'

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="max-w-[100px] truncate font-mono text-xs">
        {row.original.id || '-'}
      </span>
    )
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Actor
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="max-w-[150px] truncate text-sm">
        {row.original.actorUsername || row.original.actorid || '-'}
      </span>
    )
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Action
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.action || '-'}</Badge>
    )
  },
  {
    accessorKey: 'workspaceId',
    header: 'Workspace',
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.workspaceId || '-'}
      </span>
    )
  },
  {
    accessorKey: 'workbenchId',
    header: 'Workbench',
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.workbenchId || '-'}
      </span>
    )
  },
  {
    accessorKey: 'userId',
    header: 'User',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.userId || '-'}</span>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className="max-w-[300px] truncate text-sm">
        {row.original.description || '-'}
      </span>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.createdAt
          ? formatDistanceToNow(new Date(row.original.createdAt), {
              addSuffix: true
            })
          : '-'}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.createdAt
        ? new Date(rowA.original.createdAt).getTime()
        : 0
      const b = rowB.original.createdAt
        ? new Date(rowB.original.createdAt).getTime()
        : 0
      return a - b
    }
  }
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditTable({
  entries,
  title = 'Audit Log',
  description = 'Detailed list of all audit entries.'
}: {
  entries: AuditEntry[] | undefined
  title?: string
  description?: string
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: entries ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 }
    }
  })

  const toggleRow = (id: string | undefined) => {
    if (!id) return
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit entries…"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const entry = row.original
                return (
                  <>
                    <TableRow
                      key={row.id}
                      className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
                      onClick={() => toggleRow(entry.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedId === entry.id && (
                      <TableRow key={`${row.id}-details`}>
                        <TableCell
                          colSpan={columns.length}
                          className="bg-muted/20 p-4"
                        >
                          <pre className="max-h-[300px] overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs">
                            {entry.details &&
                            Object.keys(entry.details).length > 0
                              ? JSON.stringify(entry.details, null, 2)
                              : 'No details available.'}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No audit entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{' '}
          of <strong>{table.getFilteredRowModel().rows.length}</strong> audit
          entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
