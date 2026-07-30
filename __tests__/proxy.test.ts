import { buildCsp, buildXpraCsp } from '@/proxy'

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

  it('includes API HTTPS and WebSocket origins in connect-src', () => {
    const csp = buildCsp(base)
    expect(csp).toContain(
      "connect-src 'self' https://api.example.com wss://api.example.com"
    )
  })

  it('includes Matomo host in connect-src when provided', () => {
    const csp = buildCsp({ ...base, matomoUrl: 'https://matomo.example.com' })
    expect(csp).toContain('https://matomo.example.com wss://matomo.example.com')
  })

  it('uses matching HTTP and WebSocket schemes', () => {
    const cspHttps = buildCsp({
      ...base,
      matomoUrl: 'https://matomo.example.com'
    })
    const cspHttp = buildCsp({
      ...base,
      matomoUrl: 'http://matomo.example.com'
    })
    expect(cspHttps).toContain(
      'https://matomo.example.com wss://matomo.example.com'
    )
    expect(cspHttp).toContain(
      'http://matomo.example.com ws://matomo.example.com'
    )
  })

  it('omits Matomo token from connect-src when matomoUrl is empty', () => {
    const csp = buildCsp({ ...base, matomoUrl: '' })
    expect(csp).toContain(
      "connect-src 'self' https://api.example.com wss://api.example.com"
    )
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
    expect(csp).not.toContain('ws://localhost:*')
    expect(csp).not.toContain('wss://localhost:*')
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

describe('buildXpraCsp', () => {
  it('allows the vendored bootstrap, workers and WASM', () => {
    const csp = buildXpraCsp({
      apiUrl: base.apiUrl,
      isDev: false
    })

    expect(csp).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:"
    )
    expect(csp).toContain("worker-src 'self' blob:")
    expect(csp).toContain(
      "connect-src 'self' https://api.example.com wss://api.example.com"
    )
  })

  it('keeps framing restricted to the Chorus origin', () => {
    const csp = buildXpraCsp({
      apiUrl: base.apiUrl,
      isDev: false
    })

    expect(csp).toContain("frame-ancestors 'self'")
    expect(csp).toContain("object-src 'none'")
  })
})
