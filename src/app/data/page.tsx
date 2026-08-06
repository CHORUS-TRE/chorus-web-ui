'use client'

import { Database, Files, PackageOpen } from 'lucide-react'
import Link from 'next/link'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'

export default function DataPage() {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const accessibleWorkspaces = (workspaces ?? [])
    .filter((workspace) =>
      user?.rolesWithContext?.some(
        (role) => role.context.workspace === workspace.id
      )
    )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <section className="h-full overflow-auto rounded-xl border border-muted/40 bg-contrast-background/70">
      <header className="border-b border-muted/40 px-5 py-4">
        <h2 className="text-lg font-semibold">All workspace data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a workspace to browse its shared files and data stores.
        </p>
      </header>

      {accessibleWorkspaces.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <Database className="h-9 w-9 opacity-40" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No workspaces available
            </p>
            <p className="mt-1 text-xs">
              Workspace data will appear here when access is granted.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {accessibleWorkspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/data/${workspace.id}`}
              className="group rounded-lg border border-muted/40 bg-contrast-background/70 p-4 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <PackageOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold group-hover:text-accent">
                    {workspace.name}
                  </h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    Owner: {workspace.dev?.owner || 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Files className="h-3.5 w-3.5" />
                <span>{workspace.dev?.files ?? 0} files</span>
                <span className="ml-auto font-mono text-[10px]">
                  ID {workspace.id}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
