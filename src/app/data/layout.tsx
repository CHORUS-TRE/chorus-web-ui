'use client'

import { Database } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { cn } from '@/lib/utils'

const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
const Login = React.lazy(() =>
  import('@/components/login').then((mod) => ({
    default: mod.Login
  }))
)

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthentication()

  if (!user) return <Login />

  return <AuthenticatedApp>{<DataShell>{children}</DataShell>}</AuthenticatedApp>
}

function DataShell({ children }: { children: React.ReactNode }) {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const params = useParams<{ workspaceId?: string }>()
  const activeWorkspaceId = params?.workspaceId ?? null

  const accessibleWorkspaces = (workspaces ?? [])
    .filter((workspace) =>
      user?.rolesWithContext?.some(
        (role) => role.context.workspace === workspace.id
      )
    )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Database className="h-9 w-9" />
          Data
        </h2>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-56 shrink-0 flex-col rounded-xl border border-muted/40 bg-card">
          <div className="border-b border-muted/40 px-4 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Workspaces
            </span>
          </div>
          <nav className="flex-1 space-y-1 overflow-auto p-2">
            {accessibleWorkspaces.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No workspaces available.
              </div>
            ) : (
              accessibleWorkspaces.map((workspace) => {
                const isActive = workspace.id === activeWorkspaceId
                return (
                  <Link
                    key={workspace.id}
                    href={`/data/${workspace.id}`}
                    className={cn(
                      'block truncate rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    {workspace.name}
                  </Link>
                )
              })
            )}
          </nav>
        </aside>

        <main className="min-h-0 min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
