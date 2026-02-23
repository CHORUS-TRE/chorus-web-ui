'use client'

import { Settings } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '~/components/forms/workspace-forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

export default function WorkspaceSettingsPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { can, PERMISSIONS } = useAuthorization()
  const workspaces = useAppState((state) => state.workspaces)
  const [activeTab, setActiveTab] = useState('general')
  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const [deleted, setDeleted] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
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
    <div className="w-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="h-6 w-6" />
            Workspace Settings
          </h2>
          <p className="text-muted-foreground">
            Manage workspace configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>General Configuration</CardTitle>
            <CardDescription>Update workspace settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl">
              <Button onClick={() => setOpen(true)}>
                Edit Workspace Details
              </Button>
              {open && (
                <WorkspaceUpdateForm
                  workspace={workspace}
                  state={[open, setOpen]}
                  onSuccess={() => {
                    // refresh handled by store usually or parent
                    refreshWorkspaces()
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Delete Workspace</CardTitle>
            <CardDescription>Delete workspace</CardDescription>
          </CardHeader>
          <CardContent className="max-w-xl">
            <Button onClick={() => setDeleteOpen(true)}>
              Delete Workspace
            </Button>
            {deleteOpen && (
              <WorkspaceDeleteForm
                id={workspace?.id}
                state={[deleteOpen, setDeleteOpen]}
                onSuccess={() => {
                  refreshWorkspaces()
                  router.push('/workspaces')
                  setDeleted(true)
                  setTimeout(() => {
                    setDeleted(false)
                  }, 3000)
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
