'use client'

import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'

// Removed useRouter
import { Notification } from '@/domain/model'
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

export default function NotificationsTable({
  notifications,
  title = 'System Notifications',
  description = 'Detailed list of all system notifications and alerts.'
}: {
  notifications: Notification[] | undefined
  title?: string
  description?: string
}) {
  // const router = useRouter()

  const getTargetUser = (notification: Notification) => {
    return notification.userId || 'Global'
  }

  const isRead = (notification: Notification) => {
    return !!notification.readAt
  }

  const getNotificationType = (notification: Notification) => {
    if (notification.content?.approvalRequestNotification) return 'Approval'
    if (notification.content?.systemNotification) return 'System'
    return 'General'
  }

  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
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
                Type
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Message
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Target User
              </TableHead>
              <TableHead className="text-center font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications?.map((notification) => (
              <TableRow
                key={notification.id}
                className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
              >
                <TableCell className="max-w-[100px] truncate font-mono text-xs">
                  {notification.id}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getNotificationType(notification)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate font-medium">
                  {notification.message || 'No message'}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {getTargetUser(notification)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={isRead(notification) ? 'outline' : 'default'}
                    className={
                      !isRead(notification)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : ''
                    }
                  >
                    {isRead(notification) ? 'Read' : 'Unread'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {notification.createdAt
                    ? formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(!notifications || notifications.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No notifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{notifications?.length || 0}</strong> notifications
        </div>
      </CardFooter>
    </Card>
  )
}
