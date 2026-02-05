'use client'

import { User as UserIcon } from 'lucide-react'
import React from 'react'

const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
const Login = React.lazy(() =>
  import('@/components/login').then((mod) => ({
    default: mod.Login
  }))
)
import { useAuthentication } from '@/providers/authentication-provider'

import { SettingsTabs } from './settings-tabs'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthentication()

  if (!user) return <Login />

  return (
    <div className="w-full">
      <AuthenticatedApp>
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 px-8 text-start">
            <UserIcon className="h-9 w-9" />
            User Settings
          </h2>
        </div>
        <div className="px-8">
          <SettingsTabs />
        </div>

        <div className="float-start flex w-full">
          <main className="w-full px-8">{children}</main>
        </div>
      </AuthenticatedApp>
    </div>
  )
}
