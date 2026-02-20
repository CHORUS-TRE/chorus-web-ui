'use client'

import { formatDistanceToNow } from 'date-fns'
import { ScrollText } from 'lucide-react'

import { AuditEntry } from '@/domain/model'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/card'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'

export default function AuditTable({
  entries,
  title = 'Audit Log',
  description = 'Detailed list of all audit entries.'
}: {
  entries: AuditEntry[] | undefined
  title?: string
  description?: string
}) {
  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                ID
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                User
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Action
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Workspace
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Workbench
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Description
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries?.map((entry) => (
              <TableRow
                key={entry.id}
                className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
              >
                <TableCell className="max-w-[100px] truncate font-mono text-xs">
                  {entry.id}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-sm">
                  {entry.username || entry.userId || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{entry.action || '-'}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {entry.workspaceId || '-'}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {entry.workbenchId || '-'}
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-sm">
                  {entry.description || '-'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.createdAt
                    ? formatDistanceToNow(new Date(entry.createdAt), {
                        addSuffix: true
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(!entries || entries.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No audit entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{entries?.length || 0}</strong> audit entries
        </div>
      </CardFooter>
    </Card>
  )
}
