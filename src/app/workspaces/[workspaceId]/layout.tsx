'use client'

import { PackageOpen } from 'lucide-react'
import Link from 'next/link'
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
          <PackageOpen className="h-9 w-9 text-white" />
          <Link
            href={`/workspaces/${workspace?.id}`}
            className="text-white hover:bg-inherit hover:text-accent"
          >
            {workspace ? (
              params?.workspaceId === user?.workspaceId ? (
                'Private Workspace'
              ) : (
                workspace.shortName
              )
            ) : (
              <span className="animate-pulse text-muted">
                Loading workspace...
              </span>
            )}
          </Link>
        </h2>
      </div>
      {children}
    </>
  )
}
