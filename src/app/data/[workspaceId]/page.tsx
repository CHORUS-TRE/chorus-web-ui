'use client'

import { useParams } from 'next/navigation'

import FileManagerClient from '@/app/workspaces/[workspaceId]/data/file-manager-client'
import { useAppState } from '@/stores/app-state-store'

export default function DataWorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const workspace = workspaces?.find((w) => w.id === workspaceId)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 text-sm text-muted-foreground">
        Data <span className="px-1">/</span>
        <span className="text-foreground">{workspace?.name ?? workspaceId}</span>
      </div>
      <div className="min-h-0 flex-1">
        <FileManagerClient workspaceId={workspaceId} />
      </div>
    </div>
  )
}
