'use client'

import { CheckCircle2, Eye, Globe, Info, Shield } from 'lucide-react'
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

type EditTab = 'general' | 'security' | 'resources' | 'services' | 'visibility'

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
      <section className="mb-8">
        <h1 className="text-3xl font-semibold text-muted-foreground">
          Workspace Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage identity, security policies, and workspace lifecycle.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* General */}
          <div className="rounded-2xl border border-muted/40 bg-contrast-background/70 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">General</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basic workspace identity and ownership.
                </p>
              </div>
              <Button variant="outline" onClick={() => openEdit('general')}>
                Edit
              </Button>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Workspace name
                </dt>
                <dd className="mt-1 flex items-center gap-2 font-medium">
                  {workspace.name}
                  {workspace.isMain && <Badge variant="secondary">Main</Badge>}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Slug</dt>
                <dd className="mt-1 font-medium">
                  {workspace.shortName || workspace.namespace || '—'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Description</dt>
                <dd className="mt-1 text-muted-foreground">
                  {workspace.description || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Owner</dt>
                <dd className="mt-1 font-medium">
                  {workspace.dev?.owner || '—'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Security policies */}
          <div className="rounded-2xl border border-muted/40 bg-contrast-background/70 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Security policies</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Network and interaction restrictions applied to this
                  workspace.
                </p>
              </div>
              <Button variant="outline" onClick={() => openEdit('security')}>
                Edit policy
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
                <div>
                  <p className="font-medium">
                    {networkPolicy === 'FQDNAllowlist'
                      ? 'FQDN Allowlist'
                      : networkPolicy === 'Airgapped'
                        ? 'Airgapped network'
                        : networkPolicy === 'Open'
                          ? 'Open network'
                          : 'Network policy'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {networkPolicy === 'Airgapped'
                      ? 'All external traffic is blocked.'
                      : networkPolicy === 'Open'
                        ? 'External traffic is allowed.'
                        : networkPolicy === 'FQDNAllowlist'
                          ? allowedFqdns.length > 0
                            ? `${allowedFqdns.slice(0, 3).join(', ')}${allowedFqdns.length > 3 ? ` (+${allowedFqdns.length - 3} more)` : ''}`
                            : 'No FQDNs allowed'
                          : 'No policy configured.'}
                  </p>
                  {networkStatusText && (
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      {/complete|applied|open/i.test(networkStatusText) ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Info className="h-3.5 w-3.5" />
                      )}
                      <span>{networkStatusText}</span>
                    </div>
                  )}
                </div>
                {networkPolicy && (
                  <Badge variant="secondary">{networkPolicy}</Badge>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
                <div>
                  <p className="font-medium">Clipboard access</p>
                  <p className="text-sm text-muted-foreground">
                    {clipboard === 'disabled'
                      ? 'Copy and paste are disabled.'
                      : clipboard === 'both'
                        ? 'Copy and paste are enabled in both directions.'
                        : clipboard === 'to-server'
                          ? 'Paste into the session is allowed.'
                          : clipboard === 'to-client'
                            ? 'Copy from the session is allowed.'
                            : 'No clipboard policy configured.'}
                  </p>
                </div>
                <Badge variant="secondary">{clipboard || '—'}</Badge>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="rounded-2xl border border-muted/40 bg-contrast-background/70 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Visibility</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {workspace.visibility === 'WORKSPACE_VISIBILITY_PUBLIC'
                    ? 'This workspace is discoverable by all platform users.'
                    : 'This workspace is only visible to its members.'}
                </p>
              </div>
              <Button variant="outline" onClick={() => openEdit('visibility')}>
                <Eye className="h-4 w-4" />
                Edit
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  {workspace.visibility === 'WORKSPACE_VISIBILITY_PUBLIC' ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="font-medium">
                    {workspace.visibility === 'WORKSPACE_VISIBILITY_PUBLIC'
                      ? 'Public'
                      : 'Private'}
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  {workspace.visibility === 'WORKSPACE_VISIBILITY_PUBLIC' ? (
                    <>
                      <Globe className="h-3 w-3" /> Public
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3" /> Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
            <h3 className="text-xl font-semibold text-destructive">
              Danger zone
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Permanently delete this workspace, including configuration and
              related resources. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              className="mt-5"
              onClick={() => setDeleteOpen(true)}
            >
              Delete workspace
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-muted/40 bg-contrast-background/70 p-6">
            <h3 className="text-lg font-semibold">Workspace status</h3>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">{networkPolicy || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clipboard</span>
                <span className="font-medium">{clipboard || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium">
                  {workspace.visibility === 'WORKSPACE_VISIBILITY_PUBLIC'
                    ? 'Public'
                    : 'Private'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-muted/40 bg-contrast-background/70 p-6">
            <h3 className="text-lg font-semibold">Quick actions</h3>
            <div className="mt-5 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/workspaces/${workspaceId}/audit`)}
              >
                View audit log
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/workspaces/${workspaceId}/users`)}
              >
                Manage members
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push(`/workspaces/${workspaceId}/services`)
                }
              >
                Configure services
              </Button>
            </div>
          </div>
        </aside>
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
