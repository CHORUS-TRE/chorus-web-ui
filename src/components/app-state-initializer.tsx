'use client'

import { useEffect } from 'react'

import { useUploadWarning } from '@/hooks/use-upload-warning'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppStateStore } from '@/stores/app-state-store'

export function AppStateInitializer() {
  const { user } = useAuthentication()
  const initialize = useAppStateStore((state) => state.initialize)

  useUploadWarning()

  useEffect(() => {
    initialize(user)
  }, [initialize, user])

  return null
}
