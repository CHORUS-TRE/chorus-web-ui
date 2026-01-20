'use client'

import { useEffect } from 'react'

import { USER_CONFIG_KEYS } from '@/domain/model/user-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

declare global {
  interface Window {
    _paq?: unknown[]
  }
}

export const MatomoConsentSync = () => {
  const { getUser, isUserLoaded } = useDevStoreCache()
  const consent = getUser(USER_CONFIG_KEYS.COOKIE_CONSENT)

  useEffect(() => {
    if (isUserLoaded) {
      if (consent === 'true') {
        window._paq?.push(['rememberConsentGiven'])
      } else if (consent === 'false') {
        window._paq?.push(['forgetConsentGiven'])
      }
    }
  }, [isUserLoaded, consent])

  return null
}
