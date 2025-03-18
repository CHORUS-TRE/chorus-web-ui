import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Add any providers that components need during testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Add providers here as needed */}
      {children}
    </>
  )
}

type CustomRenderResult = RenderResult & {
  user: ReturnType<typeof userEvent.setup>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): CustomRenderResult => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options })
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override the render method
export { customRender as render }

/**
 * Mock implementations for various hooks and contexts used throughout the application
 */

/**
 * Mock for next/navigation hooks
 */
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn()
}

export const mockPathname = '/'
export const mockSearchParams = new URLSearchParams()

export const mockUseRouter = () => mockRouter
export const mockUsePathname = () => mockPathname
export const mockUseSearchParams = () => mockSearchParams

/**
 * Create a mock repository for domain testing
 * @param implementation Partial implementation of the repository methods
 * @returns A mocked repository
 */
export function createMockRepository<T>(implementation: Partial<T> = {}): T {
  return implementation as T
}

/**
 * Helper to create a mock API response
 * @param data The data to include in the response
 * @param status HTTP status code (default: 200)
 * @returns A mock Response object
 */
export function createMockApiResponse<T>(data: T, status = 200): Response {
  return {
    json: () => Promise.resolve({ result: data }),
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers({ 'Content-Type': 'application/json' })
  } as Response
}

/**
 * Wait for a condition to be true
 * @param callback Function that returns a boolean
 * @param options Options for the wait
 * @returns A promise that resolves when the condition is true
 */
export async function waitFor(
  callback: () => boolean,
  { timeout = 1000, interval = 50 } = {}
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (callback()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error(`Timed out after ${timeout}ms waiting for condition to be true`)
}
