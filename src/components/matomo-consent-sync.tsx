'use client'

import { useEffect } from 'react'

import { USER_CONFIG_KEYS } from '@/domain/model/user-config'
import { Analytics } from '@/lib/analytics/service'
import { useAuthorization } from '@/providers/authorization-provider'
import { useDevStoreCache } from '@/stores/dev-store-cache'

export const MatomoConsentSync = () => {
  const { getUser, isUserLoaded } = useDevStoreCache()
  const { isAdmin } = useAuthorization()
  const consent = getUser(USER_CONFIG_KEYS.COOKIE_CONSENT)

  // Sync consent state with Matomo on load / state change
  useEffect(() => {
    if (!isUserLoaded) return

    if (consent === 'true') {
      window._paq?.push(['setConsentGiven'])
      window._paq?.push(['rememberConsentGiven'])
      window._paq?.push(['setCookieConsentGiven'])
    } else if (consent === 'false') {
      window._paq?.push(['forgetConsentGiven'])
      window._paq?.push(['deleteCookies'])
    }
  }, [isUserLoaded, consent])

  // Set UserRole custom dimension once after login
  useEffect(() => {
    if (!isUserLoaded) return

    const role = isAdmin ? 'Admin' : 'Researcher'
    Analytics.setUserRole(role)
  }, [isUserLoaded, isAdmin])

  return null
}
