'use client'

import { Home, PackageOpen } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const workspace = workspaces?.find((w) => w.id === params?.workspaceId)
  return (
    <>
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          {params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9 text-secondary" />
          ) : (
            <PackageOpen className="h-9 w-9 text-white" />
          )}

          {workspace ? (
            workspace.name
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
