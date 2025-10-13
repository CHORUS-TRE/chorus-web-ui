'use client'

import { Home, PackageOpen } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { Breadcrumb, BreadcrumbList } from '~/components/ui/breadcrumb'
import { BreadcrumbItem } from '~/components/ui/breadcrumb'
import { BreadcrumbLink } from '~/components/ui/breadcrumb'
import { BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { BreadcrumbPage } from '~/components/ui/breadcrumb'

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
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">CHORUS</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/workspaces">Workspaces</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/workspaces/${workspace?.id}`}>
                {workspace && workspace.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {subRouteLabel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subRouteLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          {params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9 text-white" />
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
