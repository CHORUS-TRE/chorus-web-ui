'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Package, PackageOpen } from 'lucide-react'

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
      <div className="flex items-center justify-start w-full flex-grow">
        <h2 className="mb-8 mt-5 text-white w-full text-start flex flex-row items-center gap-3">
          <PackageOpen className="h-9 w-9 text-white" />
          <Link
            href={`/workspaces/${workspace?.id}`}
            className="text-white hover:bg-inherit hover:text-accent"
          >
            {workspace ? (
              params?.workspaceId === user?.workspaceId ? (
                'Home'
              ) : (
                workspace.shortName
              )
            ) : (
              <span className="animate-pulse text-muted-foreground">
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
