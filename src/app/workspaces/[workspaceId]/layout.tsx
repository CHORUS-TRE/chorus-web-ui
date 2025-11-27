'use client'

import { Home, PackageOpen } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const params = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const { user } = useAuthentication()
  const workspace = workspaces?.find((w) => w.id === params?.workspaceId)

  // Extract the path segment after workspaceId
  const pathSegments = pathname.split('/').filter(Boolean)
  const workspaceIdIndex = pathSegments.indexOf(params?.workspaceId || '')
  const subRoute =
    workspaceIdIndex >= 0 && pathSegments[workspaceIdIndex + 1]
      ? pathSegments[workspaceIdIndex + 1]
      : null

  // Capitalize first letter for display
  const subRouteLabel = subRoute
    ? subRoute.charAt(0).toUpperCase() + subRoute.slice(1)
    : null
  return (
    <>
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
          {params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9" />
          ) : (
            <PackageOpen className="h-9 w-9" />
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
