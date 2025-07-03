'use client'

import { Home, PackageOpen } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

import { useAppState } from '~/components/store/app-state-context'
import { useAuth } from '~/components/store/auth-context'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const { user } = useAuth()
  const workspace = workspaces?.find((w) => w.id === params?.workspaceId)
  return (
    <>
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          {params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9 text-white" />
          ) : (
            <PackageOpen className="h-9 w-9 text-white" />
          )}

          {workspace ? (
            params?.workspaceId === user?.workspaceId ? (
              'My Workspace'
            ) : (
              workspace.shortName
            )
          ) : (
            <span className="animate-pulse text-muted">
              Loading workspace...
            </span>
          )}
        </h2>
      </div>
      {children}
    </>
  )
}
