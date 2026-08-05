import { DEFAULT_SESSION_XPRA_SETTINGS } from '@/domain/model/session-settings'
import { layoutFromLocale, resolveKeyboardLayout } from '@/lib/keyboard-layouts'

const defaults = DEFAULT_SESSION_XPRA_SETTINGS

describe('layoutFromLocale', () => {
  it.each([
    ['fr-CH', 'ch'],
    ['de-CH', 'ch'],
    ['it-CH', 'ch'],
    ['fr-FR', 'fr'],
    ['de-DE', 'de'],
    ['it-IT', 'it'],
    ['en-GB', 'gb'],
    ['en-US', 'us']
  ])('maps %s to %s', (locale, expected) => {
    expect(layoutFromLocale(locale)).toBe(expected)
  })

  it('falls back to us for an unmapped locale', () => {
    expect(layoutFromLocale('ja-JP')).toBe('us')
  })

  it('falls back to us for a missing locale', () => {
    expect(layoutFromLocale('')).toBe('us')
  })
})

describe('resolveKeyboardLayout', () => {
  it('prefers the explicit user choice over the locale', () => {
    expect(
      resolveKeyboardLayout(undefined, { ...defaults, keyboardLayout: 'fr' })
    ).toBe('fr')
  })

  it('falls back to the browser locale when no choice was made', () => {
    const spy = jest
      .spyOn(navigator, 'language', 'get')
      .mockReturnValue('fr-CH')

    expect(resolveKeyboardLayout(undefined, defaults)).toBe('ch')

    spy.mockRestore()
  })

  it('ignores a workbench without a layout field', () => {
    const spy = jest
      .spyOn(navigator, 'language', 'get')
      .mockReturnValue('en-US')

    expect(resolveKeyboardLayout({ id: '42' }, defaults)).toBe('us')

    spy.mockRestore()
  })
})
