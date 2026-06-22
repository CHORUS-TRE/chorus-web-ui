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
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { useAuthentication } from '@/providers/authentication-provider'
import { TermsOfUseGate } from '@/providers/terms-of-use-provider'
import { useUserPreferences } from '@/stores/user-preferences-store'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthentication()
  const hasCompletedOnboarding = useUserPreferences(
    (s) => s.hasCompletedOnboarding
  )

  if (!user) return <Login />

  if (!hasCompletedOnboarding) return <OnboardingWizard />

  return (
    <TermsOfUseGate>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </TermsOfUseGate>
  )
}
