'use client'

import { AppStateProvider } from '@/components/store/app-state-context'
import { AuthProvider } from '@/components/store/auth-context'
import { User } from '~/domain/model'

interface ProvidersProps {
  children: React.ReactNode
  authenticated: boolean
  initialUser?: User
}

export function Providers({
  children,
  authenticated,
  initialUser
}: ProvidersProps) {
  return (
    <AuthProvider authenticated={authenticated} initialUser={initialUser}>
      <AppStateProvider>{children}</AppStateProvider>
    </AuthProvider>
  )
}
