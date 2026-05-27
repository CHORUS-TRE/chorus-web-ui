'use client'

import { CheckCircle2, Cog, Info, Pencil, Shield } from 'lucide-react'
import Image from 'next/image'
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
  const { can, PERMISSIONS } = useAuthorization()
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

  if (!can(PERMISSIONS.createWorkspace, { workspace: workspace.id })) {
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

  const networkAccent =
    networkPolicy === 'Open'
      ? 'text-green-500 bg-green-500/15'
      : networkPolicy === 'FQDNAllowlist'
        ? 'text-yellow-500 bg-yellow-500/15'
        : 'text-red-500 bg-red-500/15'

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

      <div className="flex flex-col gap-3">
        <SettingsCard
          icon={
            workspace.dev?.image ? (
              <Image
                src={workspace.dev.image}
                alt={workspace.name}
                fill
                className="object-cover"
              />
            ) : (
              <Cog className="h-5 w-5 text-accent" />
            )
          }
          iconBg={workspace.dev?.image ? '' : 'bg-accent/15'}
          title={workspace.name}
          badge={
            workspace.isMain ? <Badge variant="secondary">Main</Badge> : null
          }
          meta={[workspace.shortName, workspace.namespace]
            .filter(Boolean)
            .join(' · ')}
          subInfo={workspace.description || undefined}
          status={
            workspace.dev?.owner ? `Owned by ${workspace.dev.owner}` : undefined
          }
          onEdit={() => openEdit('general')}
        />

        <SettingsCard
          icon={<Shield className={`h-5 w-5 ${networkAccent.split(' ')[0]}`} />}
          iconBg={networkAccent.split(' ')[1]}
          title="Security"
          badge={
            networkPolicy ? (
              <Badge variant="secondary">{networkPolicy}</Badge>
            ) : null
          }
          meta={clipboard ? `Clipboard: ${clipboard}` : undefined}
          subInfo={
            networkPolicy === 'FQDNAllowlist'
              ? allowedFqdns.length > 0
                ? `FQDNs: ${allowedFqdns.slice(0, 3).join(', ')}${
                    allowedFqdns.length > 3
                      ? ` (+${allowedFqdns.length - 3} more)`
                      : ''
                  }`
                : 'No FQDNs allowed'
              : undefined
          }
          status={
            workspace.networkPolicyStatus || workspace.networkPolicyMessage
              ? `${workspace.networkPolicyStatus ?? ''}${
                  workspace.networkPolicyStatus &&
                  workspace.networkPolicyMessage
                    ? ': '
                    : ''
                }${workspace.networkPolicyMessage ?? ''}`
              : undefined
          }
          onEdit={() => openEdit('security')}
        />
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

function SettingsCard({
  icon,
  iconBg,
  title,
  badge,
  meta,
  subInfo,
  status,
  onEdit
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  badge?: React.ReactNode
  meta?: string
  subInfo?: string
  status?: string
  onEdit: () => void
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-4">
        <div
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md ${iconBg}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{title}</span>
            {badge}
            {meta && (
              <span className="text-sm text-muted-foreground">{meta}</span>
            )}
          </div>
          {subInfo && (
            <div className="mt-1 truncate text-sm text-muted-foreground">
              {subInfo}
            </div>
          )}
          {status && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              {status.toLowerCase().includes('complete') ||
              status.toLowerCase().includes('applied') ||
              status.toLowerCase().includes('open') ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Info className="h-3.5 w-3.5" />
              )}
              <span className="truncate">{status}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="text-muted-foreground"
          size="icon"
          onClick={onEdit}
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
