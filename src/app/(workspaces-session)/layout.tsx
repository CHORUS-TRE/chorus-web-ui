'use client'

import React from 'react'

import BackgroundIframe from '~/components/background-iframe'

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

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthentication()

  return user ? (
    <AuthenticatedApp>
      {children}
      <BackgroundIframe />
    </AuthenticatedApp>
  ) : (
    <Login />
  )
}
