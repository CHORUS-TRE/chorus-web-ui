'use client'

import React from 'react'

const AuthenticatedApp = React.lazy(() =>
  import('@/components/authenticated-app').then((mod) => ({
    default: mod.AuthenticatedApp
  }))
)
const UnauthenticatedApp = React.lazy(() =>
  import('@/components/unauthenticated-app').then((mod) => ({
    default: mod.UnauthenticatedApp
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
    <AuthenticatedApp>{children}</AuthenticatedApp>
  ) : (
    <UnauthenticatedApp />
  )
}
