import type { NextRequest } from 'next/server'

import { updateSession } from '@/components/actions/authentication-view-model'

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const session = request.cookies.get('session')?.value

  // Disallow browsing '/' if not authenticated, redirect to login page
  if (!session && request.nextUrl.pathname === '/') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  // Redirect to authentication page if not authenticated and trying to access other pages
  if (
    !session &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/oauthredirect')
  ) {
    const loginUrl = new URL('/login', request.url)
    // Encode the full URL to prevent manipulation
    loginUrl.searchParams.set(
      'redirect',
      request.nextUrl.pathname + request.nextUrl.search
    )
    return Response.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
