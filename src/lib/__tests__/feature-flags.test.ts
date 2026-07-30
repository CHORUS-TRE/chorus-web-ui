import { xpraClientSource } from '@/lib/feature-flags'

// jest.setup.js mocks next-runtime-env's env() onto process.env, so setting the
// variable there is how a test drives the flag (same as __tests__/chat-route.test.ts).
describe('xpraClientSource', () => {
  const original = process.env.NEXT_PUBLIC_XPRA_CLIENT

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_XPRA_CLIENT
    else process.env.NEXT_PUBLIC_XPRA_CLIENT = original
  })

  it("returns 'remote' when NEXT_PUBLIC_XPRA_CLIENT is not set", () => {
    delete process.env.NEXT_PUBLIC_XPRA_CLIENT
    expect(xpraClientSource()).toBe('remote')
  })

  it("returns 'local' when NEXT_PUBLIC_XPRA_CLIENT is 'local'", () => {
    process.env.NEXT_PUBLIC_XPRA_CLIENT = 'local'
    expect(xpraClientSource()).toBe('local')
  })

  it("returns 'remote' for any other value", () => {
    for (const value of ['true', 'LOCAL', 'remote', '']) {
      process.env.NEXT_PUBLIC_XPRA_CLIENT = value
      expect(xpraClientSource()).toBe('remote')
    }
  })
})
