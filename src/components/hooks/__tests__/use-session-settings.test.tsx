import { act, render, screen } from '@testing-library/react'

import { useSessionSettings } from '@/components/hooks/use-session-settings'

function Probe({ sessionId }: { sessionId: string }) {
  const { settings, update } = useSessionSettings(sessionId)
  return (
    <div>
      <span data-testid="layout">{settings.keyboardLayout || 'unset'}</span>
      <button onClick={() => update({ keyboardLayout: 'ch' })}>set ch</button>
    </div>
  )
}

describe('useSessionSettings', () => {
  beforeEach(() => localStorage.clear())

  it('starts from the stored defaults', () => {
    render(<Probe sessionId="42" />)
    expect(screen.getByTestId('layout')).toHaveTextContent('unset')
  })

  it('re-renders every consumer of the same session on update', () => {
    render(
      <>
        <Probe sessionId="42" />
        <Probe sessionId="42" />
      </>
    )

    act(() => {
      screen.getAllByRole('button', { name: 'set ch' })[0].click()
    })

    const [first, second] = screen.getAllByTestId('layout')
    expect(first).toHaveTextContent('ch')
    expect(second).toHaveTextContent('ch')
  })

  it('does not leak an update across sessions', () => {
    render(
      <>
        <Probe sessionId="42" />
        <Probe sessionId="99" />
      </>
    )

    act(() => {
      screen.getAllByRole('button', { name: 'set ch' })[0].click()
    })

    const [fortyTwo, ninetyNine] = screen.getAllByTestId('layout')
    expect(fortyTwo).toHaveTextContent('ch')
    expect(ninetyNine).toHaveTextContent('unset')
  })
})
