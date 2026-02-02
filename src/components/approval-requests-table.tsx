'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
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

export default function ApprovalRequestsTable({
  requests,
  title = 'Data Requests',
  description = 'Manage all data extraction and transfer requests.'
}: {
  requests: ApprovalRequest[] | undefined
  title?: string
  description?: string
}) {
  const router = useRouter()

  const getStatusBadge = (status: ApprovalRequestStatus | undefined) => {
    switch (status) {
      case ApprovalRequestStatus.PENDING:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        )
      case ApprovalRequestStatus.APPROVED:
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
        )
      case ApprovalRequestStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>
      case ApprovalRequestStatus.CANCELLED:
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeLabel = (type: ApprovalRequestType | undefined) => {
    switch (type) {
      case ApprovalRequestType.DATA_EXTRACTION:
        return 'Data Extraction'
      case ApprovalRequestType.DATA_TRANSFER:
        return 'Data Transfer'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-muted-foreground" />
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
                Title
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Type
              </TableHead>
              <TableHead className="text-center font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Requester
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
                onClick={() =>
                  router.push(`/admin/data-requests/${request.id}`)
                }
              >
                <TableCell className="max-w-[100px] truncate font-mono text-xs">
                  {request.id}
                </TableCell>
                <TableCell className="max-w-[200px] truncate font-medium">
                  {request.title || 'Untitled Request'}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{getTypeLabel(request.type)}</span>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {request.requesterId || '-'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {request.createdAt
                    ? formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(!requests || requests.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{requests?.length || 0}</strong> requests
        </div>
      </CardFooter>
    </Card>
  )
}
