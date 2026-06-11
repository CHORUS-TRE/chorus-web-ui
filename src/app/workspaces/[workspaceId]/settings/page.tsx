'use client'

import { CheckCircle2, Info, Pencil } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'

type EditTab = 'general' | 'security' | 'resources' | 'services'

export default function WorkspaceSettingsPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { can } = useAuthorization()
  const workspaces = useAppState((state) => state.workspaces)
  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const [editOpen, setEditOpen] = useState(false)
  const [editTab, setEditTab] = useState<EditTab>('general')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  if (!workspace) {
    return <div className="p-8">Loading or Workspace not found...</div>
  }

  if (!can('createWorkspace', { workspace: workspace.id })) {
    return (
      <div className="p-8 text-destructive">
        You do not have permission to manage this workspace.
      </div>
    )
  }

  const openEdit = (tab: EditTab) => {
    setEditTab(tab)
    setEditOpen(true)
  }

  const networkPolicy = workspace.networkPolicy
  const clipboard = workspace.clipboard
  const allowedFqdns = workspace.allowedFqdns || []

  const ownerStatus = workspace.dev?.owner
    ? `Owned by ${workspace.dev.owner}`
    : undefined

  const networkStatusText =
    workspace.networkPolicyStatus || workspace.networkPolicyMessage
      ? `${workspace.networkPolicyStatus ?? ''}${
          workspace.networkPolicyStatus && workspace.networkPolicyMessage
            ? ': '
            : ''
        }${workspace.networkPolicyMessage ?? ''}`
      : undefined

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-start justify-between gap-4">
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
      </div>

      <div className="card-glass p-4">
        {/* General / identity */}
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{workspace.name}</span>
              {workspace.isMain && <Badge variant="secondary">Main</Badge>}
              {(workspace.shortName || workspace.namespace) && (
                <span className="text-sm text-muted-foreground">
                  {[workspace.shortName, workspace.namespace]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              )}
            </div>
            {workspace.description && (
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {workspace.description}
              </div>
            )}
            {ownerStatus && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span className="truncate">{ownerStatus}</span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="text-accent/60 hover:bg-accent/20 hover:text-accent"
            size="icon"
            onClick={() => openEdit('general')}
            aria-label="Edit general"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="my-8" />

        {/* Security */}
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="">
              <span className="font-medium">Security</span>
              {networkPolicy && (
                <Badge variant="secondary" className="ml-2">
                  {networkPolicy}
                </Badge>
              )}
              {clipboard && (
                <span className="ml-2 text-sm text-muted-foreground">
                  Clipboard <Badge variant="secondary">{clipboard}</Badge>
                </span>
              )}
            </div>

            {networkPolicy === 'FQDNAllowlist' && (
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {allowedFqdns.length > 0
                  ? `FQDNs: ${allowedFqdns.slice(0, 3).join(', ')}${
                      allowedFqdns.length > 3
                        ? ` (+${allowedFqdns.length - 3} more)`
                        : ''
                    }`
                  : 'No FQDNs allowed'}
              </div>
            )}

            {networkStatusText && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                {/complete|applied|open/i.test(networkStatusText) ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Info className="h-3.5 w-3.5" />
                )}
                <span className="truncate">{networkStatusText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[editOpen, setEditOpen]}
          initialTab={editTab}
          onSuccess={() => refreshWorkspaces()}
        />
      )}

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
  )
}
