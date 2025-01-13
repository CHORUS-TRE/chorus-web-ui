import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { updateSession } from '@/components/actions/authentication-view-model'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Disallow browsing '/' if not authenticated, redirect to login page
  if (!session && request.nextUrl.pathname === '/') {
    return Response.redirect(
      new URL('/login' + '?redirect=' + request.nextUrl.pathname, request.url)
    )
  }

  // Redirect to authentication page if not authenticated and trying to access other pages
  if (
    !session &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/oauthredirect')
  ) {
    return Response.redirect(new URL('/login', request.url))
  }

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || // exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    pathname === '/manifest.json' || // exclude manifest file
    pathname === '/sw.js' || // exclude service worker
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next()
  }

  // Your existing middleware logic here
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (Service Worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)'
  ]
}
