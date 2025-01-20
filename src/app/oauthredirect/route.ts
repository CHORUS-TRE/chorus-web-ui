import { NextRequest } from 'next/server'

import { handleOAuthRedirect } from '@/components/actions/authentication-view-model'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get('state') || ''
  const [originalState, providerId] = state.split(':')

  const queryParams = {
    id: providerId || 'keycloak',
    state: originalState,
    sessionState: searchParams.get('session_state') || undefined,
    code: searchParams.get('code') || undefined
  }

  try {
    const response = await handleOAuthRedirect(queryParams)

    if (response.error) {
      throw new Error(response.error)
    }

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`, 302)
  } catch (error) {
    console.error('OAuth redirect error:', error)
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=Authentication failed`,
      302
    )
  }
}
