'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import {
  clearRedirectUrl,
  getAndClearRedirectUrl
} from '@/utils/redirect-storage'
import { handleOAuthRedirect } from '@/view-model/authentication-view-model'

export default function OAuthRedirectPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    async function processRedirect() {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const sessionState = searchParams.get('session_state')
      const [originalState, providerId] = (state || ':').split(':')

      if (code && state) {
        try {
          const queryParams = {
            id: providerId.replace(/(%2F|\/)/g, '') || 'keycloak',
            state: originalState,
            sessionState: sessionState || undefined,
            code: code || undefined
          }

          const response = await handleOAuthRedirect(queryParams)
          if (response.error) {
            throw new Error(response.error)
          }

          // Get stored redirect URL or fallback to home
          const redirectUrl = getAndClearRedirectUrl() || '/'
          window.location.href = redirectUrl
        } catch (error) {
          console.error('OAuth redirect error:', error)
          clearRedirectUrl()

          if (error instanceof Error) {
            router.push(`/?error=${error.message}`)
          } else {
            router.push('/?error=An unknown error occurred')
          }
        }
      } else {
        // Clear any stored redirect URL on invalid request
        clearRedirectUrl()
        router.push('/?error=Invalid authentication request')
      }
    }

    processRedirect()
  }, [searchParams, router])
  return null
}
