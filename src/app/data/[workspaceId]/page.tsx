'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import FileManagerClient from '@/app/workspaces/[workspaceId]/data/file-manager-client'
import { useAppState } from '@/stores/app-state-store'

export default function DataWorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const workspace = workspaces?.find((w) => w.id === workspaceId)

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-muted/40 bg-contrast-background/70">
      <header className="flex flex-shrink-0 items-center gap-4 border-b border-muted/40 px-5 py-3.5">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">
            {workspace?.name ?? workspaceId}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shared workspace data
          </p>
        </div>
        <Link
          href={`/workspaces/${workspaceId}/data`}
          className="ml-auto inline-flex h-8 items-center gap-2 rounded-lg border border-muted px-3 text-xs font-medium transition-colors hover:bg-muted/50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in workspace
        </Link>
      </header>
      <div className="min-h-0 flex-1 p-4">
        <FileManagerClient workspaceId={workspaceId} />
      </div>
    </section>
  )
}
