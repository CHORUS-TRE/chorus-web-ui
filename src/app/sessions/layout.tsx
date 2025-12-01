'use client'

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

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return true ? <AuthenticatedApp>{children}</AuthenticatedApp> : <Login />
}
