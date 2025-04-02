// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import nodeFetch from 'node-fetch'
import { TextDecoder, TextEncoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Create minimal implementations of Web API classes
class MockRequest {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.toString()
    this.method = init.method || 'GET'
    this.headers = new Headers(init.headers || {})
    this.body = init.body || null
    this.bodyUsed = false
  }

  clone() {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    })
  }
}

class MockResponse {
  constructor(body = null, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new Headers(init.headers || {})
    this.type = 'basic'
    this.url = init.url || ''
    this.statusText = init.statusText || ''
  }

  json() {
    return Promise.resolve(
      typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    )
  }

  text() {
    return Promise.resolve(String(this.body))
  }

  clone() {
    return new MockResponse(this.body, {
      status: this.status,
      headers: this.headers,
      url: this.url,
      statusText: this.statusText
    })
  }
}

class MockHeaders {
  constructor(init = {}) {
    this.headers = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key, value)
      })
    }
  }

  get(name) {
    return this.headers.get(name) || null
  }

  set(name, value) {
    this.headers.set(name, value)
  }

  has(name) {
    return this.headers.has(name)
  }

  delete(name) {
    this.headers.delete(name)
  }

  append(name, value) {
    this.headers.set(name, value)
  }
}

// Mock AbortController if not already available
if (typeof global.AbortController === 'undefined') {
  global.AbortController = class MockAbortController {
    constructor() {
      this.signal = { aborted: false }
    }
    abort() {
      this.signal.aborted = true
    }
  }
}

// Install global mocks for Web API
global.Request = global.Request || MockRequest
global.Response = global.Response || MockResponse
global.Headers = global.Headers || MockHeaders
global.ReadableStream = global.ReadableStream || class MockReadableStream {}
global.FormData = global.FormData || class MockFormData {}
global.Blob = global.Blob || class MockBlob {}
global.URL = global.URL || class MockURL {}
global.URLSearchParams = global.URLSearchParams || class MockURLSearchParams {}

// Mock nextjs-specific objects
global.__NEXT_DATA__ = {
  props: {},
  page: '',
  query: {},
  buildId: 'test-build-id'
}

// Mock ResizeObserver which is used by some components
global.ResizeObserver = class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia which is used by some components
global.matchMedia =
  global.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  }))

// Mock fetch function
global.fetch = jest.fn().mockImplementation((url) => {
  console.log('Mock fetch called with:', url)
  return Promise.resolve(
    new MockResponse(JSON.stringify({ result: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  )
})

// Mock next/navigation functions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn()
  }),
  useSearchParams: () => ({ get: jest.fn() }),
  usePathname: () => '/'
}))

// Mock next/font to avoid font loading issues
jest.mock('next/font/google', () => ({
  __esModule: true,
  default: () => ({
    className: 'mocked-font-class'
  })
}))

// Mock next-runtime-env
jest.mock('next-runtime-env', () => ({
  __esModule: true,
  env: (key) => process.env[key] || null
}))

// Mock env variables used by next-runtime-env
process.env.NEXT_PUBLIC_DATA_SOURCE_API_URL = 'http://localhost:3000'
