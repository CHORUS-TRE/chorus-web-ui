'use client'

import { useParams } from 'next/navigation'
import * as React from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'
import { useAuthentication } from '~/providers/authentication-provider'

import RequestsClient from './requests-client'

export default function RequestsPage() {
  const { user } = useAuthentication()
  const { workspaceId } = useParams() as { workspaceId: string }
  const [requests, setRequests] = React.useState<ApprovalRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData(id: string) {
      setIsLoading(true)
      try {
        const requestsRes = await listApprovalRequests({
          filterSourceWorkspaceId: id
        })

        if (requestsRes.data) {
          setRequests(requestsRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch requests data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData(workspaceId)
  }, [])

  if (isLoading || !user) {
    return <LoadingOverlay isLoading={true} />
  }

  // Map backend user to the simplified format RequestsClient expects
  // In the real app, we might check workspace roles for 'approve' permission
  const mappedUser = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    permissions: {
      // Mocking approval permission for now based on if user has ANY role
      // In a real implementation, we would check for a specific governance role
      approve: true
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-muted-foreground">
            Data Requests
          </h1>
          <p className="mb-8 text-muted-foreground">
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
