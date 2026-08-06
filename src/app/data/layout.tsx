'use client'

import { ChevronRight, Database, PackageOpen, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'

const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
const Login = React.lazy(() =>
  import('@/components/login').then((mod) => ({ default: mod.Login }))
)

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthentication()

  if (!user) return <Login />

  return (
    <AuthenticatedApp>
      <DataShell>{children}</DataShell>
    </AuthenticatedApp>
  )
}

function DataShell({ children }: { children: React.ReactNode }) {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const params = useParams<{ workspaceId?: string }>()
  const activeWorkspaceId = params?.workspaceId ?? null
  const [query, setQuery] = React.useState('')

  const accessibleWorkspaces = React.useMemo(
    () =>
      (workspaces ?? [])
        .filter((workspace) =>
          user?.rolesWithContext?.some(
            (role) => role.context.workspace === workspace.id
          )
        )
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [user?.rolesWithContext, workspaces]
  )

  const visibleWorkspaces = accessibleWorkspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex flex-shrink-0 items-center justify-between gap-3">
        <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Database className="h-7 w-7 text-primary" />
          Data
        </h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-xl border border-muted/40 bg-contrast-background/70 p-3">
          <nav
            className="min-h-0 space-y-1 overflow-auto"
            aria-label="Data spaces"
          >
            <Link
              href="/data"
              className={cn(
                'flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                !activeWorkspaceId
                  ? 'bg-accent/15 text-accent'
                  : 'text-muted-foreground hover:text-accent'
              )}
            >
              <Database className="h-4 w-4" />
              <span className="flex-1">All workspaces</span>
              <span className="text-[10px] opacity-70">
                {accessibleWorkspaces.length}
              </span>
            </Link>

            {visibleWorkspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId
              return (
                <Link
                  key={workspace.id}
                  href={`/data/${workspace.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted-foreground hover:text-accent'
                  )}
                >
                  <ChevronRight
                    className={cn('h-3.5 w-3.5', isActive && 'rotate-90')}
                  />
                  <PackageOpen className="h-4 w-4 shrink-0" />
                  <span className="truncate">{workspace.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="min-h-0 min-w-0">{children}</main>
      </div>
    </div>
  )
}
