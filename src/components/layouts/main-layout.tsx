'use client'

import React, { useEffect } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { useAppState } from '@/components/store/app-state-context'
import { useAuth } from '~/components/store/auth-context'
import { ToastAction } from '~/components/ui/toast'
import { Toaster } from '~/components/ui/toaster'

import { AuthenticatedApp } from './authenticated-app'
import { UnauthenticatedApp } from './unauthenticated-app'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth()

  return (
    <>
      {user ? (
        <AuthenticatedApp>{children}</AuthenticatedApp>
      ) : (
        <UnauthenticatedApp />
      )}
      <Toaster />
    </>
  )
}
