'use client'

import { FileCheck } from 'lucide-react'
import { useEffect } from 'react'

import ApprovalRequestsTable from '@/components/approval-requests-table'
import { useAppState } from '@/stores/app-state-store'

export default function AdminDataRequestsPage() {
  const { approvalRequests, refreshApprovalRequests } = useAppState()

  useEffect(() => {
    refreshApprovalRequests()
  }, [refreshApprovalRequests])

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <FileCheck className="h-9 w-9" />
        Data Requests Management
      </h1>
      <p className="mb-8 text-muted-foreground">
        Review and manage all data extraction and transfer requests initiated by
        users.
      </p>

      <div className="w-full">
        <ApprovalRequestsTable requests={approvalRequests} />
      </div>
    </div>
  )
}
