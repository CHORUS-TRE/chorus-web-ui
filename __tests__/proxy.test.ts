import { buildCsp } from '@/proxy'

const base = {
  nonce: 'dGVzdG5vbmNlMTI=',
  apiUrl: 'https://api.example.com',
  matomoUrl: '',
  isDev: false
}

describe('buildCsp', () => {
  it('sets script-src to nonce + strict-dynamic (no unsafe-inline in script-src)', () => {
    const csp = buildCsp(base)
    expect(csp).toContain(
      "script-src 'nonce-dGVzdG5vbmNlMTI=' 'strict-dynamic'"
    )
    const scriptSrc = csp.match(/script-src [^;]+/)![0]
    expect(scriptSrc).not.toContain('unsafe-inline')
  })

  it('includes API host (scheme-agnostic) in connect-src', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("connect-src 'self' api.example.com")
  })

  it('includes Matomo host in connect-src when provided', () => {
    const csp = buildCsp({ ...base, matomoUrl: 'https://matomo.example.com' })
    expect(csp).toContain(
      "connect-src 'self' api.example.com matomo.example.com"
    )
  })

  it('produces the same connect-src token regardless of http or https scheme in Matomo URL', () => {
    const cspHttps = buildCsp({
      ...base,
      matomoUrl: 'https://matomo.example.com'
    })
    const cspHttp = buildCsp({
      ...base,
      matomoUrl: 'http://matomo.example.com'
    })
    expect(cspHttps.match(/connect-src [^;]+/)?.[0]).toBe(
      cspHttp.match(/connect-src [^;]+/)?.[0]
    )
  })

  it('omits Matomo token from connect-src when matomoUrl is empty', () => {
    const csp = buildCsp({ ...base, matomoUrl: '' })
    expect(csp).toContain("connect-src 'self' api.example.com")
    expect(csp).not.toContain('undefined')
  })

  it('sets frame-src to self plus the API host', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("frame-src 'self' api.example.com")
  })

  it('frame-src falls back to self-only when apiUrl is empty', () => {
    const csp = buildCsp({ ...base, apiUrl: '' })
    const match = csp.match(/frame-src ([^;]+)/)!
    expect(match[1].trim()).toBe("'self'")
  })

  it('includes ws://localhost:* in connect-src in dev mode', () => {
    const csp = buildCsp({ ...base, isDev: true })
    expect(csp).toContain('ws://localhost:*')
    expect(csp).toContain('wss://localhost:*')
  })

  it('omits ws://localhost:* from connect-src in production', () => {
    const csp = buildCsp({ ...base, isDev: false })
    expect(csp).not.toContain('ws://')
    expect(csp).not.toContain('wss://')
  })

  it('always sets frame-ancestors self', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("frame-ancestors 'self'")
  })

  it('always sets object-src none', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("object-src 'none'")
  })

  it('always sets base-uri self', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("base-uri 'self'")
  })

  it('always sets form-action self', () => {
    const csp = buildCsp(base)
    expect(csp).toContain("form-action 'self'")
  })
})
