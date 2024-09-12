import type { NextRequest } from 'next/server'

import { updateSession } from '@/components/actions/authentication-login-view-model'

export async function middleware(request: NextRequest) {
  await updateSession(request)
  const session = request.cookies.get('session')?.value

  // Allow browsing the '/' page without restrictions
  // if (request.nextUrl.pathname === '/') {
  //   return
  // }

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
    !request.nextUrl.pathname.startsWith('/register')
  ) {
    return Response.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
