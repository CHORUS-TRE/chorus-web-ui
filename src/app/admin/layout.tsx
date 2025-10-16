'use client'

import React, { useEffect } from 'react'
const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
import { Package } from 'lucide-react'
import Link from 'next/link'

import { AdminSidebar } from '@/components/ui/admin-sidebar'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { UnauthenticatedApp } from '~/components/unauthenticated-app'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { setBackground } = useAppState()
  const { user } = useAuthentication()

  useEffect(() => {
    setBackground((prev) => {
      if (prev?.workspaceId) {
        return { sessionId: undefined, workspaceId: prev.workspaceId }
      }
      return prev
    })
  }, [setBackground])

  if (!user) return <UnauthenticatedApp />

  return (
    <>
      <div className="w-full">
        <AuthenticatedApp>
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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between gap-3">
              <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
                <Package className="h-9 w-9 text-white" />
                Settings
              </h2>
            </div>
          </>
          <div className="flex">
            <SidebarProvider>
              <AdminSidebar />
              <main className="w-full text-white">
                {/* <SidebarTrigger /> */}
                <div className="flex-1 p-8">
                  <DynamicBreadcrumb />
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </div>
        </AuthenticatedApp>
      </div>
    </>
  )
}
