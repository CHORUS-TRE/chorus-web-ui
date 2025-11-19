import { render, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ReactElement } from 'react'

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

/**
 * Create a mock repository for domain testing
 * @param implementation Partial implementation of the repository methods
 * @returns A mocked repository
 */
export function createMockRepository<T>(implementation: Partial<T> = {}): T {
  return implementation as T
}
