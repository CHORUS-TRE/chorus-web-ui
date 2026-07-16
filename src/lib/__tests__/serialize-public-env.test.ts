import { serializePublicEnv } from '@/lib/serialize-public-env'

describe('serializePublicEnv', () => {
  it('round-trips plain values through JSON.parse', () => {
    const env = {
      NEXT_PUBLIC_API_URL: 'https://backend.example.com',
      NEXT_PUBLIC_API_SUFFIX: '/api/rest/v1'
    }
    expect(JSON.parse(serializePublicEnv(env))).toEqual(env)
  })

  it('escapes < so a value cannot terminate the inline <script> block', () => {
    const env = {
      NEXT_PUBLIC_EVIL: '</script><script>alert(1)</script>'
    }
    const serialized = serializePublicEnv(env)
    expect(serialized).not.toContain('<')
    // The escaped form must still decode to the original value.
    expect(JSON.parse(serialized)).toEqual(env)
  })

  it('escapes U+2028 and U+2029 line separators', () => {
    const env = { NEXT_PUBLIC_ODD: 'a\u2028b\u2029c' }
    const serialized = serializePublicEnv(env)
    expect(serialized).not.toContain('\u2028')
    expect(serialized).not.toContain('\u2029')
    expect(JSON.parse(serialized)).toEqual(env)
  })

  it('drops undefined values like JSON.stringify does', () => {
    const env = { NEXT_PUBLIC_SET: 'x', NEXT_PUBLIC_UNSET: undefined }
    expect(JSON.parse(serializePublicEnv(env))).toEqual({
      NEXT_PUBLIC_SET: 'x'
    })
  })
})
