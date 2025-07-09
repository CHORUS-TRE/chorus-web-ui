'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { handleOAuthRedirect } from '@/components/actions/authentication-view-model'

export default function OAuthRedirectPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('Processing authentication...')

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

          window.location.href = '/'
        } catch (error) {
          console.error('OAuth redirect error:', error)
          if (error instanceof Error) {
            router.push(`/?error=${error.message}`)
          } else {
            router.push('/?error=An unknown error occurred')
          }
        }
      } else {
        router.push('/?error=Invalid authentication request')
      }
    }

    processRedirect()
  }, [searchParams, router])

  return <div>{message}</div>
}
