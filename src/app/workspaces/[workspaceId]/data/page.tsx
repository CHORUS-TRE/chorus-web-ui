'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useAppState } from '@/stores/app-state-store'

import FileManagerClient from './file-manager-client'

export default function FileManager() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const workspace = workspaces?.find((w) => w.id === workspaceId)

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-muted/40 bg-contrast-background/70">
      <header className="flex flex-shrink-0 items-center gap-3 border-b border-muted/40 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">
            {workspace?.name ?? workspaceId}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shared workspace data
          </p>
        </div>
        <Link
          href={`/data/${workspaceId}`}
          className="ml-auto inline-flex h-8 items-center gap-2 rounded-lg border border-muted px-3 text-xs font-medium transition-colors hover:bg-muted/50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Data
        </Link>
      </header>
      <div className="min-h-0 flex-1 p-4">
        <FileManagerClient workspaceId={workspaceId} />
      </div>
    </section>
  )
}
