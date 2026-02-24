'use client'

import React, { useEffect } from 'react'
const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
import { Package, ShieldAlert, SlidersHorizontal } from 'lucide-react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { Login } from '~/components/login'
import { Unauthorized } from '~/components/unauthorized'

import { AdminTabs } from './admin-tabs'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { setActiveIframe } = useIframeCache()
  const { user } = useAuthentication()
  const { isAdmin } = useAuthorization()

  // Clear active iframe when navigating to admin pages
  useEffect(() => {
    setActiveIframe(null)
  }, [setActiveIframe])

  if (!user) return <Login />

  return (
    <>
      <div className="w-full">
        <AuthenticatedApp>
          {!isAdmin && <Unauthorized />}

          {isAdmin && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
                  <SlidersHorizontal className="h-9 w-9" />
                  Admin
                </h2>
              </div>
              <AdminTabs />

              <div className="float-start flex w-full">
                <main className="w-full px-8">{children}</main>
              </div>
            </>
          )}
        </AuthenticatedApp>
      </div>
    </>
  )
}
