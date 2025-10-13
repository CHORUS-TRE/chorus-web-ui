'use client'

import { useParams } from 'next/navigation'

import WorkspaceUserTable from '~/components/workspace-user-table'

export default function UsersPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId

  if (!workspaceId) {
    return null
  }

  return (
    <div className="flex flex-col">
      <WorkspaceUserTable
        workspaceId={workspaceId}
        title="Workspace Members"
        description="Manage users and their roles in this workspace"
      />
    </div>
  )
}
