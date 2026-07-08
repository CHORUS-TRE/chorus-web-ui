'use client'

import { Database } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'

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

  return (
    <AuthenticatedApp>{<DataShell>{children}</DataShell>}</AuthenticatedApp>
  )
}

function DataShell({ children }: { children: React.ReactNode }) {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const params = useParams<{ workspaceId?: string }>()
  const activeWorkspaceId = params?.workspaceId ?? null
  const router = useRouter()

  const accessibleWorkspaces = (workspaces ?? [])
    .filter((workspace) =>
      user?.rolesWithContext?.some(
        (role) => role.context.workspace === workspace.id
      )
    )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

  // Land on the first accessible workspace instead of the empty placeholder.
  React.useEffect(() => {
    if (!activeWorkspaceId && accessibleWorkspaces.length > 0) {
      router.replace(`/data/${accessibleWorkspaces[0].id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspaceId, accessibleWorkspaces.length])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Database className="h-9 w-9" />
          Data
        </h2>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-56 shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Workspaces
            </h3>
            {accessibleWorkspaces.length === 0 ? (
              <div className="px-3 py-1.5 text-xs text-muted-foreground">
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
                      'flex items-center truncate rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-muted-foreground hover:text-accent'
                    )}
                  >
                    {workspace.name}
                  </Link>
                )
              })
            )}
          </div>
        </aside>

        <main className="min-h-0 min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
