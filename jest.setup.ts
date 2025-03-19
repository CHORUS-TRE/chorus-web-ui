// Learn more: https://github.com/testing-library/jest-dom
import { TextDecoder, TextEncoder } from 'util'

import '@testing-library/jest-dom'

// Add TextEncoder and TextDecoder to the global scope
// Properly cast with 'as any' to avoid type errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextEncoder = TextEncoder as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any

// Mock fetch API
class MockRequest implements Partial<Request> {
  readonly cache: RequestCache = 'default'
  readonly credentials: RequestCredentials
  readonly destination: RequestDestination = '' as RequestDestination
  readonly headers: Headers
  readonly integrity: string = ''
  readonly keepalive: boolean = false
  readonly method: string
  readonly mode: RequestMode = 'cors'
  readonly redirect: RequestRedirect = 'follow'
  readonly referrer: string = 'about:client'
  readonly referrerPolicy: ReferrerPolicy = 'no-referrer'
  readonly signal: AbortSignal = new AbortController().signal
  readonly url: string
  readonly body: ReadableStream | null = null
  readonly bodyUsed: boolean = false

  constructor(input: RequestInfo | URL, init: RequestInit = {}) {
    this.url = typeof input === 'string' ? input : input.toString()
    this.method = init.method || 'GET'
    this.headers = new Headers(init.headers || {})
    this.credentials = init.credentials || 'same-origin'
  }

  clone(): Request {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers,
      credentials: this.credentials
    }) as unknown as Request
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0))
  }

  blob(): Promise<Blob> {
    return Promise.resolve(new Blob())
  }

  formData(): Promise<FormData> {
    return Promise.resolve(new FormData())
  }

  json<T = unknown>(): Promise<T> {
    return Promise.resolve({} as T)
  }

  text(): Promise<string> {
    return Promise.resolve('')
  }
}

class MockResponse implements Partial<Response> {
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean = false
  readonly status: number
  readonly statusText: string
  readonly type: ResponseType = 'default'
  readonly url: string = ''
  readonly body: ReadableStream | null = null
  readonly bodyUsed: boolean = false
  readonly trailer: Promise<Headers> = Promise.resolve(new Headers())
  private responseBody: unknown

  constructor(body: unknown = null, init: ResponseInit = {}) {
    this.responseBody = body
    this.status = init.status || 200
    this.statusText = init.statusText || ''
    this.headers = new Headers(init.headers || {})
    this.ok = this.status >= 200 && this.status < 300
  }

  clone(): Response {
    return new MockResponse(this.responseBody, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    }) as unknown as Response
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0))
  }

  blob(): Promise<Blob> {
    return Promise.resolve(new Blob())
  }

  formData(): Promise<FormData> {
    return Promise.resolve(new FormData())
  }

  json<T = unknown>(): Promise<T> {
    return Promise.resolve(
      typeof this.responseBody === 'string'
        ? (JSON.parse(this.responseBody) as T)
        : (this.responseBody as T)
    )
  }

  text(): Promise<string> {
    return Promise.resolve(String(this.responseBody))
  }
}

// Assign the mock implementations to global
global.Request = MockRequest as unknown as typeof global.Request
global.Response = MockResponse as unknown as typeof global.Response

// Mock fetch function
global.fetch = jest.fn().mockImplementation((_url: RequestInfo | URL) => {
  console.log('fetch', _url)
  return Promise.resolve(
    new MockResponse(JSON.stringify({ data: 'mock data' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }) as unknown as Response
  )
})
