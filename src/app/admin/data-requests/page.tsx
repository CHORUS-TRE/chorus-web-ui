'use client'

import { FileCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

import ApprovalRequestsTable from '@/components/approval-requests-table'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { APPROVAL_REQUESTS_FETCH_LIMIT } from '@/lib/approval-request-utils'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'

export default function AdminDataRequestsPage() {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>()

  useEffect(() => {
    async function loadApprovalRequests() {
      const result = await listApprovalRequests({
        paginationLimit: APPROVAL_REQUESTS_FETCH_LIMIT
      })
      if (result.error) {
        console.error('Failed to load approval requests:', result.error)
        return
      }
      setApprovalRequests(result.data)
    }
    loadApprovalRequests()
  }, [])

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
