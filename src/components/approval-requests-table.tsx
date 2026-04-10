'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { User } from '@/domain/model/user'
import { useAppState } from '@/stores/app-state-store'
import { listUsers } from '@/view-model/user-view-model'

export default function ApprovalRequestsTable({
  requests,
  title,
  description
}: {
  requests: ApprovalRequest[] | undefined
  title?: string
  description?: string
}) {
  const router = useRouter()
  const { workspaces } = useAppState()
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map())

  useEffect(() => {
    async function fetchUsers() {
      const result = await listUsers()
      if (result.data) {
        const map = new Map<string, User>()
        result.data.forEach((u) => {
          if (u.id) map.set(u.id, u)
        })
        setUsersMap(map)
      }
    }
    fetchUsers()
  }, [])

  const getWorkspaceName = useCallback(
    (request: ApprovalRequest) => {
      const wsId =
        request.dataExtraction?.sourceWorkspaceId ||
        request.dataTransfer?.sourceWorkspaceId
      if (!wsId) return '—'
      return workspaces?.find((w) => w.id === wsId)?.name || wsId
    },
    [workspaces]
  )

  const getRequesterUsername = useCallback(
    (requesterId: string | undefined) => {
      if (!requesterId) return '—'
      const user = usersMap.get(requesterId)
      return user?.username || requesterId
    },
    [usersMap]
  )

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
      {title && (
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{title}</CardTitle>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 font-semibold text-foreground">
                ID
              </TableHead>
              <TableHead className="p-2 font-semibold text-foreground">
                Title
              </TableHead>
              <TableHead className="p-2 font-semibold text-foreground">
                Type
              </TableHead>
              <TableHead className="p-2 font-semibold text-foreground">
                Workspace
              </TableHead>
              <TableHead className="p-2 text-center font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="p-2 font-semibold text-foreground">
                Requester
              </TableHead>
              <TableHead className="p-2 font-semibold text-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-muted/10"
                onClick={() =>
                  router.push(`/admin/data-requests/${request.id}`)
                }
              >
                <TableCell className="max-w-[100px] truncate p-2 font-mono text-xs">
                  {request.id}
                </TableCell>
                <TableCell className="max-w-[200px] truncate p-2 font-medium">
                  {request.title || 'Untitled Request'}
                </TableCell>
                <TableCell className="p-2">
                  <span className="text-sm">{getTypeLabel(request.type)}</span>
                </TableCell>
                <TableCell className="max-w-[150px] truncate p-2 text-sm">
                  {getWorkspaceName(request)}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="p-2 text-sm">
                  {getRequesterUsername(request.requesterId)}
                </TableCell>
                <TableCell className="p-2 text-xs text-muted-foreground">
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
                  colSpan={7}
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
