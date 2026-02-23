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
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <FileCheck className="h-9 w-9" />
              Data Requests Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Review and manage all data extraction and transfer requests
                initiated by users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <ApprovalRequestsTable requests={approvalRequests} />
      </div>
    </>
  )
}
