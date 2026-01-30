'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Filter,
  MoreVertical,
  Trash2
} from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { markNotificationsAsRead } from '@/view-model/notification-view-model'
import { useAuthentication } from '~/providers/authentication-provider'
import { useAppState } from '~/stores/app-state-store'

export default function NotificationsPage() {
  const { user } = useAuthentication()
  const {
    notifications,
    refreshNotifications,
    refreshUnreadNotificationsCount
  } = useAppState()
  const { userId } = (useParams() ?? {}) as { userId?: string }

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filteredNotifications = useMemo(() => {
    if (!notifications) return []
    if (filter === 'unread') return notifications.filter((n) => !n.readAt)
    if (filter === 'read') return notifications.filter((n) => !!n.readAt)
    return notifications
  }, [notifications, filter])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationsAsRead([id])
    await refreshNotifications()
    await refreshUnreadNotificationsCount()
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      ?.filter((n) => !n.readAt && n.id)
      .map((n) => n.id as string)
    if (unreadIds && unreadIds.length > 0) {
      await markNotificationsAsRead(unreadIds)
      await refreshNotifications()
      await refreshUnreadNotificationsCount()
    }
  }

  if (user?.id !== userId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Bell className="h-9 w-9" />
            Notifications
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={!notifications?.some((n) => !n.readAt)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="card-glass border-muted/40 shadow-xl backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Inbox</CardTitle>
                <CardDescription>
                  Manage your system and approval notifications
                </CardDescription>
              </div>
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as 'all' | 'unread' | 'read')}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Separator className="mb-2" />
            <div className="flex flex-col">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Bell className="mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No {filter !== 'all' ? filter : ''} notifications found
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`group relative flex gap-4 px-6 py-4 transition-colors hover:bg-muted/30 ${
                      !notification.readAt ? 'bg-primary/5' : ''
                    }`}
                  >
                    {!notification.readAt && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                    )}
                    <div className="mt-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          notification.content?.approvalRequestNotification
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                        }`}
                      >
                        {notification.content?.approvalRequestNotification ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm ${
                            !notification.readAt ? 'font-bold' : 'font-medium'
                          }`}
                        >
                          {notification.message || 'Notification'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt
                            ? formatDistanceToNow(notification.createdAt) +
                              ' ago'
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.content?.approvalRequestNotification
                          ? 'A new approval request has been created and requires your attention.'
                          : 'You have received a new system update.'}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        {notification.content?.approvalRequestNotification && (
                          <Link
                            href={`/approvals/${notification.content.approvalRequestNotification.approvalRequestId}`}
                          >
                            <Button variant="outline" size="xs">
                              View Request
                            </Button>
                          </Link>
                        )}
                        {!notification.readAt && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleMarkAsRead(notification.id!)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.readAt ? (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id!)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Mark as read
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Already read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
