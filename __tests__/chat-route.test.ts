/**
 * @jest-environment node
 */
jest.mock('../src/app/api/.ai/agent/orchestrator', () => ({
  orchestrate: jest.fn(() => new Response('ok', { status: 200 }))
}))

import { orchestrate } from '@/app/api/.ai/agent/orchestrator'
import { isAuthenticated, POST } from '@/app/api/chat/route'

const mockBackendResponse = (status: number, ok: boolean) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ result: { me: { id: '1' } } }),
      status,
      ok
    })
  ) as jest.Mock
}

describe.skip('isAuthenticated', () => {
  it('returns false when no cookie header is present', async () => {
    expect(await isAuthenticated(null)).toBe(false)
  })

  it('returns false when the jwttoken cookie is absent, even with other cookies present', async () => {
    const result = await isAuthenticated(
      '_pk_id.1.1fff=2e49eb75b3bfd6bf; mtm_consent=1'
    )
    expect(result).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns false when the backend rejects the extracted token', async () => {
    mockBackendResponse(401, false)
    expect(await isAuthenticated('jwttoken=invalid')).toBe(false)
  })

  it('returns true when the backend confirms the extracted token', async () => {
    mockBackendResponse(200, true)
    expect(await isAuthenticated('jwttoken=valid')).toBe(true)
  })

  it('extracts the jwttoken value from among other cookies and forwards it as a Cookie header', async () => {
    mockBackendResponse(200, true)
    await isAuthenticated(
      '_pk_id.1.1fff=2e49eb75b3bfd6bf; jwttoken=abc.def.ghi; mtm_consent=1'
    )

    const [, init] = (global.fetch as jest.Mock).mock.calls[0]
    expect(init.headers.Cookie).toBe('jwttoken=abc.def.ghi')
  })
})

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 and never invokes the orchestrator when no session cookie is present', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] })
    })

    const res = await POST(req)

    expect(res.status).toBe(401)
    expect(orchestrate).not.toHaveBeenCalled()
  })

  it('returns 401 and never invokes the orchestrator when the backend rejects the token', async () => {
    mockBackendResponse(401, false)
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { Cookie: 'jwttoken=invalid' },
      body: JSON.stringify({ messages: [] })
    })

    const res = await POST(req)

    expect(res.status).toBe(401)
    expect(orchestrate).not.toHaveBeenCalled()
  })

  it('delegates to the orchestrator when the session is valid', async () => {
    mockBackendResponse(200, true)
    const messages = [{ role: 'user', content: 'hi' }]
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { Cookie: 'jwttoken=valid' },
      body: JSON.stringify({ messages })
    })

    const res = await POST(req)

    expect(orchestrate).toHaveBeenCalledWith(messages)
    expect(res.status).toBe(200)
  })
})
