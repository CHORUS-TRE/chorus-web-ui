'use client'

import { Settings } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PERMISSIONS, ROLE_DEFINITIONS } from '@/config/permissions'
import { Workspace } from '@/domain/model'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import { WorkspaceUpdateForm } from '~/components/forms/workspace-forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function WorkspaceSettingsPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const router = useRouter()

  const { user } = useAuthentication()
  const workspaces = useAppState((state) => state.workspaces)

  const [activeTab, setActiveTab] = useState('general')
  const [canManage, setCanManage] = useState(false)

  const workspace = workspaces?.find((w) => w.id === workspaceId)

  useEffect(() => {
    // Check permissions
    // 1. Check if user is WorkspaceAdmin/Maintainer for THIS workspace
    // OR if user is SuperAdmin
    if (!user || !workspaceId) return

    const checkPerms = async () => {
      // We can't use flat isUserAllowed for contextual check easily unless we trust the roles
      // Simple check: iterate roles
      const hasWorkspaceRole = (roleName: string) => {
        return (
          user.rolesWithContext?.some(
            (r) =>
              r.name === roleName &&
              (r.context.workspace === workspaceId ||
                r.context.workspace === '*')
          ) ?? false
        )
      }

      const isSuperAdmin = hasWorkspaceRole(ROLE_DEFINITIONS.SuperAdmin.name)
      const isWorkspaceAdmin = hasWorkspaceRole(
        ROLE_DEFINITIONS.WorkspaceAdmin.name
      )
      const isWorkspaceMaintainer = hasWorkspaceRole(
        ROLE_DEFINITIONS.WorkspaceMaintainer.name
      ) // Maintainer can update workspace

      if (isSuperAdmin || isWorkspaceAdmin || isWorkspaceMaintainer) {
        setCanManage(true)
      }

      // If no access, redirect?
      if (!isSuperAdmin && !isWorkspaceAdmin && !isWorkspaceMaintainer) {
        // Maybe it's just loading, or maybe denied.
        // We'll handle "Not Authorized" in render.
      }
    }

    checkPerms()
  }, [user, workspaceId])

  if (!workspace) {
    return <div className="p-8">Loading or Workspace not found...</div>
  }

  if (!canManage) {
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
            Workspace Settings: {workspace.name}
          </h2>
          <p className="text-muted-foreground">
            Manage workspace configuration and members.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Update workspace name and description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xl">
                <p className="mb-4">Use the button below to edit details.</p>
                <WorkspaceUpdatingSection workspace={workspace} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkspaceUpdatingSection({ workspace }: { workspace: Workspace }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Workspace Details</Button>
      {open && (
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[open, setOpen]}
          onSuccess={() => {
            // refresh handled by store usually or parent
            window.location.reload() // naive refresh
          }}
        />
      )}
    </>
  )
}
