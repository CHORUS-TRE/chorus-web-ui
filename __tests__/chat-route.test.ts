/**
 * @jest-environment node
 */
jest.mock('../src/app/api/.ai/agent/orchestrator', () => ({
  orchestrate: jest.fn(() => new Response('ok', { status: 200 }))
}))

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(() => jest.fn()),
  jwtVerify: jest.fn()
}))

import { jwtVerify } from 'jose'

import { orchestrate } from '@/app/api/.ai/agent/orchestrator'
import { isAuthenticated, POST } from '@/app/api/chat/route'

const mockJwtVerify = jwtVerify as jest.Mock

describe('isAuthenticated', () => {
  beforeEach(() => {
    mockJwtVerify.mockReset()
  })

  it('returns false when no cookie header is present', async () => {
    expect(await isAuthenticated(null)).toBe(false)
    expect(mockJwtVerify).not.toHaveBeenCalled()
  })

  it('returns false when the jwttoken cookie is absent, even with other cookies present', async () => {
    const result = await isAuthenticated(
      '_pk_id.1.1fff=2e49eb75b3bfd6bf; mtm_consent=1'
    )
    expect(result).toBe(false)
    expect(mockJwtVerify).not.toHaveBeenCalled()
  })

  it('returns false when the token fails verification', async () => {
    mockJwtVerify.mockRejectedValueOnce(
      new Error('signature verification failed')
    )
    expect(await isAuthenticated('jwttoken=invalid')).toBe(false)
  })

  it('returns true when the token is verified', async () => {
    mockJwtVerify.mockResolvedValueOnce({ payload: {}, protectedHeader: {} })
    expect(await isAuthenticated('jwttoken=valid')).toBe(true)
  })

  it('extracts just the token value from among other cookies and verifies it', async () => {
    mockJwtVerify.mockResolvedValueOnce({ payload: {}, protectedHeader: {} })
    await isAuthenticated(
      '_pk_id.1.1fff=2e49eb75b3bfd6bf; jwttoken=abc.def.ghi; mtm_consent=1'
    )

    expect(mockJwtVerify).toHaveBeenCalledWith(
      'abc.def.ghi',
      expect.anything(),
      expect.objectContaining({ issuer: expect.any(String) })
    )
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

  it('returns 401 and never invokes the orchestrator when the token fails verification', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('invalid token'))
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
    mockJwtVerify.mockResolvedValueOnce({ payload: {}, protectedHeader: {} })
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
