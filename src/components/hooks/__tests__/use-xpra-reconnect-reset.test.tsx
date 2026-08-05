import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'

import { useXpraReconnectReset } from '@/components/hooks/use-xpra-reconnect-reset'
import {
  DEFAULT_SESSION_XPRA_SETTINGS,
  SessionXpraSettings
} from '@/domain/model'

function Probe({
  settings,
  enabled
}: {
  settings: SessionXpraSettings
  enabled: boolean
}) {
  const [resetCount, setResetCount] = useState(0)
  useXpraReconnectReset(settings, enabled, () =>
    setResetCount((count) => count + 1)
  )
  return <span data-testid="reset-count">{resetCount}</span>
}

describe('useXpraReconnectReset', () => {
  it('does not reset on first render', () => {
    render(<Probe settings={DEFAULT_SESSION_XPRA_SETTINGS} enabled />)
    expect(screen.getByTestId('reset-count')).toHaveTextContent('0')
  })

  it('resets exactly once when a boot-time setting changes', () => {
    const { rerender } = render(
      <Probe settings={DEFAULT_SESSION_XPRA_SETTINGS} enabled />
    )

    act(() => {
      rerender(
        <Probe
          settings={{ ...DEFAULT_SESSION_XPRA_SETTINGS, encoding: 'jpeg' }}
          enabled
        />
      )
    })

    expect(screen.getByTestId('reset-count')).toHaveTextContent('1')
  })

  it('does not reset when only a live setting changes', () => {
    const { rerender } = render(
      <Probe settings={DEFAULT_SESSION_XPRA_SETTINGS} enabled />
    )

    act(() => {
      rerender(
        <Probe
          settings={{ ...DEFAULT_SESSION_XPRA_SETTINGS, audio: false }}
          enabled
        />
      )
    })

    act(() => {
      rerender(
        <Probe
          settings={{
            ...DEFAULT_SESSION_XPRA_SETTINGS,
            audio: false,
            onScreenKeyboard: true
          }}
          enabled
        />
      )
    })

    expect(screen.getByTestId('reset-count')).toHaveTextContent('0')
  })

  it('never resets when disabled, even if a boot-time setting changes', () => {
    const { rerender } = render(
      <Probe settings={DEFAULT_SESSION_XPRA_SETTINGS} enabled={false} />
    )

    act(() => {
      rerender(
        <Probe
          settings={{ ...DEFAULT_SESSION_XPRA_SETTINGS, encoding: 'jpeg' }}
          enabled={false}
        />
      )
    })

    expect(screen.getByTestId('reset-count')).toHaveTextContent('0')
  })

  it('resets on each of two consecutive boot-time changes, and not again on an unchanged key', () => {
    const { rerender } = render(
      <Probe settings={DEFAULT_SESSION_XPRA_SETTINGS} enabled />
    )

    act(() => {
      rerender(
        <Probe
          settings={{ ...DEFAULT_SESSION_XPRA_SETTINGS, encoding: 'jpeg' }}
          enabled
        />
      )
    })
    expect(screen.getByTestId('reset-count')).toHaveTextContent('1')

    act(() => {
      rerender(
        <Probe
          settings={{
            ...DEFAULT_SESSION_XPRA_SETTINGS,
            encoding: 'jpeg',
            swapKeys: true
          }}
          enabled
        />
      )
    })
    expect(screen.getByTestId('reset-count')).toHaveTextContent('2')

    // Re-render with an unchanged key (new object, same values) — no reset.
    act(() => {
      rerender(
        <Probe
          settings={{
            ...DEFAULT_SESSION_XPRA_SETTINGS,
            encoding: 'jpeg',
            swapKeys: true
          }}
          enabled
        />
      )
    })
    expect(screen.getByTestId('reset-count')).toHaveTextContent('2')
  })
})
