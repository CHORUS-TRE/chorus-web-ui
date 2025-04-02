/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import React from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../src/components/ui/card'

/**
 * This is an example of a visual regression test.
 *
 * NOTE: In an actual implementation, you would use a tool like:
 * - Storybook with Chromatic
 * - Percy
 * - Playwright with visual comparisons
 * - Cypress with visual testing plugins
 *
 * The tests below are simple snapshots to demonstrate the concept, but
 * real visual regression tests would be better implemented in a specialized tool.
 */

describe('Card Component Visual Appearance', () => {
  it('renders a basic card with the expected structure', () => {
    const { container } = render(
      <Card className="w-[350px]" data-testid="card">
        <CardHeader data-testid="card-header">
          <CardTitle data-testid="card-title">Card Title</CardTitle>
        </CardHeader>
        <CardContent data-testid="card-content">
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter data-testid="card-footer">
          <p>Card footer</p>
        </CardFooter>
      </Card>
    )

    // In a real visual regression test, we would:
    // 1. Take a screenshot of the rendered component
    // 2. Compare it with a baseline screenshot
    // 3. Fail if the difference exceeds a threshold

    // For this example, we'll simply ensure the structure is correct
    const card = container.querySelector('[data-testid="card"]')
    expect(card).toBeInTheDocument()

    // Check that all parts of the card are rendered
    expect(
      container.querySelector('[data-testid="card-header"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="card-title"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="card-content"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="card-footer"]')
    ).toBeInTheDocument()

    // Check the content is correct
    expect(container).toHaveTextContent('Card Title')
    expect(container).toHaveTextContent('Card content goes here')
    expect(container).toHaveTextContent('Card footer')
  })

  it('renders different card variants', () => {
    const { container: defaultCard } = render(
      <Card data-testid="default-card">
        <CardHeader data-testid="default-card-header">
          <CardTitle>Default Card</CardTitle>
        </CardHeader>
        <CardContent>Default styling</CardContent>
      </Card>
    )

    const { container: customCard } = render(
      <Card
        className="bg-secondary text-secondary-foreground"
        data-testid="custom-card"
      >
        <CardHeader
          className="border-b border-secondary-foreground/10"
          data-testid="custom-card-header"
        >
          <CardTitle>Custom Card</CardTitle>
        </CardHeader>
        <CardContent>Custom styling</CardContent>
      </Card>
    )

    // Verify the default card has expected content and structure
    expect(defaultCard).toHaveTextContent('Default Card')
    expect(defaultCard).toHaveTextContent('Default styling')
    expect(
      defaultCard.querySelector('[data-testid="default-card"]')
    ).toBeInTheDocument()

    // Verify the custom card has expected content and structure
    expect(customCard).toHaveTextContent('Custom Card')
    expect(customCard).toHaveTextContent('Custom styling')

    // Check that custom card has the custom class
    expect(
      customCard.querySelector('[data-testid="custom-card"]')
    ).toBeInTheDocument()
    expect(customCard.querySelector('.bg-secondary')).toBeInTheDocument()

    // In a real visual test, we would compare screenshots here
  })

  it('renders a card with a custom width and height', () => {
    const { container } = render(
      <Card className="h-[300px] w-[500px]" data-testid="large-card">
        <CardHeader>
          <CardTitle>Large Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has a custom width and height</p>
        </CardContent>
      </Card>
    )

    // Check the card has the custom width and height classes
    const card = container.querySelector('[data-testid="large-card"]')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('h-[300px]')
    expect(card).toHaveClass('w-[500px]')

    // This would be better with actual visual comparison in a dedicated tool
  })
})
