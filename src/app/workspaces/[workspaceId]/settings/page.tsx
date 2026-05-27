'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  WorkspaceDeleteForm,
  WorkspaceGeneralInlineForm
} from '@/components/forms/workspace-forms'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'

export default function WorkspaceSettingsPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { can, PERMISSIONS } = useAuthorization()
  const workspaces = useAppState((state) => state.workspaces)
  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const router = useRouter()

  if (!workspace) {
    return <div className="p-8">Loading or Workspace not found...</div>
  }

  if (!can(PERMISSIONS.createWorkspace, { workspace: workspace.id })) {
    return (
      <div className="p-8 text-destructive">
        You do not have permission to manage this workspace.
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-muted-foreground">
            Workspace Settings
          </h1>
          <p className="text-muted-foreground">
            Manage workspace configuration.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          Delete Workspace
        </Button>
        {deleteOpen && (
          <WorkspaceDeleteForm
            id={workspace.id}
            state={[deleteOpen, setDeleteOpen]}
            onSuccess={() => {
              refreshWorkspaces()
              router.push('/workspaces')
            }}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Configuration</CardTitle>
          <CardDescription>Update workspace settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkspaceGeneralInlineForm
            workspace={workspace}
            onSuccess={() => refreshWorkspaces()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
