'use client'

import React, { useEffect } from 'react'

import { Header } from '@/components/header'
import { AdminSidebar } from '@/components/ui/admin-sidebar'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
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
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full">
        <Header />
      </div>
      <div className="absolute left-0 top-0 z-40 mt-11 flex min-h-screen">
        <SidebarProvider>
          <nav className="">
            <AdminSidebar />
          </nav>
          <main className="w-full text-white">
            <SidebarTrigger />
            <div className="flex-1 p-8">
              <DynamicBreadcrumb />
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </>
  )
}
