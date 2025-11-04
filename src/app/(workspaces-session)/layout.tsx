'use client'

import React from 'react'

import BackgroundIframe from '~/components/background-iframe'

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
    <>
      {children}
      <BackgroundIframe />
    </>
  ) : (
    <UnauthenticatedApp />
  )
}
