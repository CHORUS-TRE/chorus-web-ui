import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuth } from './components/AuthContext'

export function middleware(request: NextRequest) {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.redirect(new URL('/authenticate', request.url))
}

export const config = {
  matcher: ['/dashboard'] //['/((?!api|_next/static|authenticate|_next/image|.*\\.png$).*)'],
}