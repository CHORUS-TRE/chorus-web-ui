/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '../../src/utils/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'

// Add jest-axe custom matchers
expect.extend(toHaveNoViolations)

// For this example, we'll test a simple button component
const Button = ({
  children,
  disabled,
  onClick,
  ariaLabel
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  ariaLabel?: string
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  )
}

// We'll also test a more complex button with an icon
const IconButton = ({
  icon,
  label,
  screenReaderLabel,
  disabled,
  onClick
}: {
  icon: React.ReactNode
  label?: string
  screenReaderLabel: string
  disabled?: boolean
  onClick?: () => void
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={screenReaderLabel}
      aria-disabled={disabled}
      className="icon-button"
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  )
}

describe('Button Accessibility', () => {
  it('regular button should have no accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => console.log('clicked')}>
        Click Me
      </Button>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('disabled button should have no accessibility violations', async () => {
    const { container } = render(
      <Button disabled onClick={() => console.log('clicked')}>
        Disabled Button
      </Button>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('icon-only button should have an aria-label', async () => {
    const { container } = render(
      <IconButton
        icon={<span>🔍</span>}
        screenReaderLabel="Search"
        onClick={() => console.log('search clicked')}
      />
    )

    // Check that the button has an aria-label
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Search')

    // Check for accessibility violations
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('icon button with visible text should have no accessibility violations', async () => {
    const { container } = render(
      <IconButton
        icon={<span>🔍</span>}
        label="Search"
        screenReaderLabel="Search"
        onClick={() => console.log('search clicked')}
      />
    )

    // With visible text, it's good to have the aria-label match the text
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Search')
    expect(button).toHaveTextContent('Search')

    // Check for accessibility violations
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be keyboard navigable', async () => {
    const handleClick = jest.fn()

    render(
      <>
        <Button onClick={handleClick}>First Button</Button>
        <Button onClick={handleClick}>Second Button</Button>
      </>
    )

    // Get the buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    // First button should be focused when tabbing (this is simulated here)
    if (buttons[0]) {
      buttons[0].focus()
      expect(document.activeElement).toBe(buttons[0])
    }

    // Simulate tab to move to next button
    // In a real test you'd use userEvent.tab() but we're simplifying here
    if (buttons[1]) {
      buttons[1].focus()
      expect(document.activeElement).toBe(buttons[1])

      // Simulate pressing Enter on the focused button
      // In a real test you'd use userEvent.keyboard('{Enter}')
      buttons[1].click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    }
  })

  it('should have sufficient color contrast (this would need a visual testing tool)', () => {
    // For actual color contrast testing, you would use a tool like Storybook with a11y addon
    // or Playwright, Cypress, or a dedicated tool like Axe DevTools

    // Here we're just illustrating what you'd test:
    // 1. Ensure text has sufficient contrast with its background
    // 2. Ensure focus indicators are visible
    // 3. Ensure disabled states are perceivable but clearly disabled

    // This test is a placeholder for where you'd implement visual accessibility testing
  })
})
