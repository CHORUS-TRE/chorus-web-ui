'use client'

import { Bell, CheckCircle2, Clock, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  ApprovalRequest,
  ApprovalRequestStatus
} from '@/domain/model/approval-request'
import { useAppState } from '@/stores/app-state-store'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'
import { StatCard } from '~/components/dashboard/stat-card'

const MessagesPage = () => {
  const { unreadNotificationsCount } = useAppState()
  const [requests, setRequests] = useState<ApprovalRequest[]>([])

  useEffect(() => {
    async function fetchRequests() {
      try {
        const result = await listApprovalRequests()
        if (result.data) {
          setRequests(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch approval requests:', error)
      }
    }
    fetchRequests()
  }, [])

  const { pendingCount, approvedCount } = useMemo(() => {
    const pending = requests.filter(
      (r) => r.status === ApprovalRequestStatus.PENDING
    ).length
    const approved = requests.filter(
      (r) => r.status === ApprovalRequestStatus.APPROVED
    ).length
    return { pendingCount: pending, approvedCount: approved }
  }, [requests])

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-semibold text-muted-foreground">
        Messages
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          href="/messages/notifications"
          title="Notifications"
          icon={Bell}
          value={unreadNotificationsCount}
          description="Unread Notifications"
        />

        <StatCard
          href="/messages/requests"
          title="Requests"
          icon={Package}
          value={requests.length}
          description="Total Requests"
        >
          <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-amber-500" />
              {pendingCount} Pending
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              {approvedCount} Approved
            </div>
          </div>
        </StatCard>
      </div>
    </div>
  )
}

export default MessagesPage
