'use client'

import { ReactElement, ReactNode, useEffect } from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { useDevStoreCache } from '@/stores/dev-store-cache'

/**
 * InstanceConfigInitializer loads global instance configuration (theme, logo,
 * name, headline, etc.) from the DevStore cache before authentication.
 * This ensures that the login page and other public pages can display
 * the instance branding.
 *
 * This component should be placed BEFORE AppStateProvider in the provider
 * hierarchy, and after ThemeProvider.
 *
 * Components access the config via hooks:
 * - useInstanceConfig() - full config (name, headline, tagline, etc.)
 * - useInstanceTheme() - theme colors only
 */
export const InstanceConfigInitializer = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  // Subscribe to loading state
  const isGlobalLoaded = useDevStoreCache((state) => state.isGlobalLoaded)

  useEffect(() => {
    const { initGlobal, isGlobalLoaded } = useDevStoreCache.getState()

    // Only initialize if not already loaded (idempotent)
    if (!isGlobalLoaded) {
      initGlobal()
    }
  }, [])

  // Show loading overlay while config is loading
  if (!isGlobalLoaded) {
    return <LoadingOverlay isLoading={true} delay={0} />
  }

  return <>{children}</>
}

