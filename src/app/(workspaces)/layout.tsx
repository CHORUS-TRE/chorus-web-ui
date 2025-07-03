'use client'

import React from 'react'

import BackgroundIframe from '~/components/background-iframe'

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
import { useAuth } from '~/components/store/auth-context'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuth()

  return user ? (
    <>
      {children}
      <BackgroundIframe />
    </>
  ) : (
    <UnauthenticatedApp />
  )
}
