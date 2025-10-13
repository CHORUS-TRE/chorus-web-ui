'use client'

import { Download, Search } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// Props interface for the generated DataTable
export interface DataTableProps {
  title?: string
  description?: string
  data: Array<Record<string, unknown>>
  columns: Array<{
    key: string
    label: string
    type?: 'text' | 'number' | 'date' | 'status' | 'action'
  }>
  searchable?: boolean
  exportable?: boolean
  sortable?: boolean
  className?: string
}

// Default DataTable component for generation
export function GeneratedDataTable({
  title = 'Data Table',
  description,
  data = [],
  columns = [],
  searchable = true,
  exportable = true,
  sortable = true,
  className = ''
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  )

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortColumn]
      const bVal = (b as Record<string, unknown>)[sortColumn]

      let comparison = 0
      // Convert to string for comparison if needed
      const aStr = String(aVal ?? '')
      const bStr = String(bVal ?? '')

      if (aStr < bStr) comparison = -1
      if (aStr > bStr) comparison = 1

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [filteredData, sortColumn, sortDirection])

  // Handle column header click for sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  // Export data as CSV
  const handleExport = () => {
    if (!exportable) return

    const csv = [
      columns.map((col) => col.label).join(','),
      ...sortedData.map((row) =>
        columns.map((col) => String(row[col.key] || '')).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Render cell based on column type
  const renderCell = (
    value: unknown,
    column: DataTableProps['columns'][0]
  ): React.ReactNode => {
    switch (column.type) {
      case 'status':
        return (
          <Badge variant={value === 'active' ? 'default' : 'secondary'}>
            {String(value)}
          </Badge>
        )
      case 'date':
        return new Date(String(value)).toLocaleDateString()
      case 'number':
        return typeof value === 'number'
          ? value.toLocaleString()
          : String(value || '')
      case 'action':
        return (
          <Button variant="ghost" size="sm">
            {String(value)}
          </Button>
        )
      default:
        return String(value || '')
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-8"
                />
              </div>
            )}
            {exportable && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={
                      sortable ? 'cursor-pointer hover:bg-muted/50' : ''
                    }
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      {column.label}
                      {sortable && sortColumn === column.key && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                  >
                    {searchTerm ? 'No results found' : 'No data available'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {renderCell(row[column.key], column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} items
        </div>
      </CardContent>
    </Card>
  )
}
