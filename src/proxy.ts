import { NextResponse, type NextRequest } from 'next/server'

// Returns the host (scheme-agnostic) so both http:// and https:// are matched.
// CSP host sources without a scheme match any scheme.
function originToken(url: string): string {
  if (!url) return ''
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

export function buildCsp(params: {
  apiUrl: string
  matomoUrl: string
  isDev: boolean
}): string {
  const { apiUrl, matomoUrl, isDev } = params

  const scriptSrc = ["'self'", "'unsafe-inline'", originToken(matomoUrl)]
    .filter(Boolean).join(' ')
  const connectSrc = [
    "'self'", originToken(apiUrl), originToken(matomoUrl),
    ...(isDev ? ['ws://localhost:*', 'wss://localhost:*'] : [])
  ].filter(Boolean).join(' ')

  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc}`,
    `frame-src 'self' ${originToken(apiUrl)}`.trimEnd(),
    `frame-ancestors 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ')
}

export function proxy(_request: NextRequest) {
  const response = NextResponse.next()

  const csp = buildCsp({
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
    matomoUrl: process.env.NEXT_PUBLIC_MATOMO_URL ?? '',
    isDev: process.env.NODE_ENV === 'development',
  })

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
