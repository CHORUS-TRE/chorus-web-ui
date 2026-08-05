import { fireEvent, render, screen } from '@testing-library/react'

import { SessionInputSection } from '@/components/header/session-pill'
import { readSessionSettings } from '@/lib/session-settings'
import { setXpraKeyboard } from '@/lib/xpra-session-registry'

jest.mock('../../../lib/xpra-session-registry', () => ({
  ...jest.requireActual('../../../lib/xpra-session-registry'),
  setXpraKeyboard: jest.fn()
}))

describe('SessionInputSection', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('persists the keyboard layout without touching the bridge', () => {
    render(<SessionInputSection sessionId="42" />)

    fireEvent.change(screen.getByLabelText('Keyboard layout'), {
      target: { value: 'ch' }
    })

    expect(readSessionSettings('42').keyboardLayout).toBe('ch')
    expect(setXpraKeyboard).not.toHaveBeenCalled()
  })

  it('persists swap cmd/ctrl', () => {
    render(<SessionInputSection sessionId="42" />)

    fireEvent.click(screen.getByLabelText('Swap cmd / ctrl'))

    expect(readSessionSettings('42').swapKeys).toBe(true)
  })

  it('applies the on-screen keyboard live and persists it', () => {
    render(<SessionInputSection sessionId="42" />)

    fireEvent.click(screen.getByLabelText('On-screen keyboard'))

    expect(setXpraKeyboard).toHaveBeenCalledWith('42', true)
    expect(readSessionSettings('42').onScreenKeyboard).toBe(true)
  })
})
