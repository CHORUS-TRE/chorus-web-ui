'use client'

import { useEffect } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppStateStore } from '@/stores/app-state-store'

export function AppStateInitializer() {
  const { user } = useAuthentication()
  const initialize = useAppStateStore((state) => state.initialize)

  useEffect(() => {
    initialize(user)
  }, [initialize, user])

  return null
}
