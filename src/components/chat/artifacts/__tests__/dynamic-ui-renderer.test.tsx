/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { type Spec } from '@json-render/core'
import { DynamicUIRenderer } from '../dynamic-ui-renderer'

const minimalSpec: Spec = {
  root: 'root',
  elements: {
    root: { type: 'Text', props: { text: 'hello', variant: null } }
  },
  state: {}
}

test('renders spec content', () => {
  render(<DynamicUIRenderer spec={minimalSpec} />)
  expect(screen.getByText('hello')).toBeInTheDocument()
})

test('accepts handlers prop without error', () => {
  const handlers = {
    doSomething: async (
      _params: Record<string, unknown>,
      _setState: (path: string, value: unknown) => void
    ) => {}
  }
  expect(() =>
    render(<DynamicUIRenderer spec={minimalSpec} handlers={handlers} />)
  ).not.toThrow()
})
