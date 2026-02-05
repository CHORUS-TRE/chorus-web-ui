'use client'

import { useParams } from 'next/navigation'
import * as React from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { User } from '@/domain/model/user'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'
import { userMe } from '@/view-model/user-view-model'

import RequestsClient from './requests-client'

export default function RequestsPage() {
  const { workspaceId } = useParams() as { workspaceId: string }
  const [requests, setRequests] = React.useState<ApprovalRequest[]>([])
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData(id: string) {
      setIsLoading(true)
      try {
        const [requestsRes, userRes] = await Promise.all([
          // listApprovalRequests({ filterSourceWorkspaceId: id }),
          listApprovalRequests({}),
          userMe()
        ])

        if (requestsRes.data) {
          setRequests(requestsRes.data)
        }
        if (userRes?.data) {
          setCurrentUser(userRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch requests data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (workspaceId) {
      fetchData(workspaceId)
    }
  }, [workspaceId])

  if (isLoading || !currentUser) {
    return <LoadingOverlay isLoading={true} />
  }

  // Map backend user to the simplified format RequestsClient expects
  // In the real app, we might check workspace roles for 'approve' permission
  const mappedUser = {
    id: currentUser.id,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    permissions: {
      // Mocking approval permission for now based on if user has ANY role
      // In a real implementation, we would check for a specific governance role
      approve: true
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pb-24 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Requests</h2>
          <p className="text-muted-foreground">
            Monitor and manage your data extraction and transfer requests.
          </p>
        </div>
      </div>

      <RequestsClient
        requests={requests}
        currentUser={mappedUser}
        workspaceId={workspaceId}
      />
    </div>
  )
}
