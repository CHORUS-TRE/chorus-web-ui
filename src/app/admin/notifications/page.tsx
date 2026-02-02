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
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <Bell className="h-9 w-9" />
              Notifications Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                View and track all system-wide notifications and alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <NotificationsTable notifications={notifications} />
      </div>
    </>
  )
}
