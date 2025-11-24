'use client'

import React, { useEffect } from 'react'
const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
import { Package } from 'lucide-react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { Login } from '~/components/login'

import { AdminSidebar } from './admin-sidebar'

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

  if (!user) return <Login />

  return (
    <>
      <div className="w-full">
        <AuthenticatedApp>
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
                <Package className="h-9 w-9" />
                Settings
              </h2>
            </div>
          </>
          <div className="float-start flex w-full">
            <SidebarProvider>
              <AdminSidebar />
              <main className="w-full px-8">{children}</main>
            </SidebarProvider>
          </div>
        </AuthenticatedApp>
      </div>
    </>
  )
}
