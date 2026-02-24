'use client'

import { Bell } from 'lucide-react'
import { useEffect } from 'react'

import NotificationsTable from '@/components/notifications-table'
import { useAppState } from '@/stores/app-state-store'

export default function AdminNotificationsPage() {
  const { notifications, refreshNotifications } = useAppState()

  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Bell className="h-9 w-9" />
        Notifications Management
      </h1>
      <p className="mb-8 text-muted-foreground">
        View and track all system-wide notifications and alerts.
      </p>

      <div className="w-full">
        <NotificationsTable notifications={notifications} />
      </div>
    </div>
  )
}
