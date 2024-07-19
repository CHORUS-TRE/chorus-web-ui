import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value

  // Allow browsing the '/' page without restrictions
  if (request.nextUrl.pathname === '/') {
    return
  }

  // Disallow browsing '/workspaces' if not authenticated, redirect to login page
  // if (!currentUser && request.nextUrl.pathname.startsWith('/workspaces')) {
  //   return Response.redirect(new URL('/authentication' + '?redirect=' + request.nextUrl.pathname, request.url))
  // }

  // // Redirect to authentication page if not authenticated and trying to access other pages
  // if (!currentUser && !request.nextUrl.pathname.startsWith('/authentication')) {
  //   return Response.redirect(new URL('/authentication', request.url))
  // }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
