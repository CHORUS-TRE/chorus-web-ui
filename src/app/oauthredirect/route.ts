import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { handleOAuthRedirect } from '@/components/actions/authentication-view-model'
import { env } from '@/env'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const queryParams = {
    id: 'keycloak',
    state: searchParams.get('state') || undefined,
    sessionState: searchParams.get('session_state') || undefined,
    code: searchParams.get('code') || undefined
  }

  try {
    const response = await handleOAuthRedirect(queryParams)

    if (response.error) {
      throw new Error(response.error)
    }

    return Response.redirect(`${env.NEXT_PUBLIC_APP_URL}/`, 302)
  } catch (error) {
    console.error('OAuth redirect error:', error)
    return Response.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/login?error=Authentication failed`,
      302
    )
  }
}
