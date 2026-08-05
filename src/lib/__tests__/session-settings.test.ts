import { DEFAULT_SESSION_XPRA_SETTINGS } from '@/domain/model/session-settings'
import {
  initParamsKey,
  readSessionSettings,
  subscribeSessionSettings,
  toXpraParams,
  writeSessionSettings
} from '@/lib/session-settings'

const KEY = 'chorus.session-settings.v1.42'

describe('session settings storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns the defaults when nothing is stored', () => {
    expect(readSessionSettings('42')).toEqual(DEFAULT_SESSION_XPRA_SETTINGS)
  })

  it('round-trips what was written', () => {
    writeSessionSettings('42', {
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      keyboardLayout: 'ch',
      audio: false
    })

    const read = readSessionSettings('42')
    expect(read.keyboardLayout).toBe('ch')
    expect(read.audio).toBe(false)
  })

  it('keeps sessions apart', () => {
    writeSessionSettings('42', {
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      keyboardLayout: 'ch'
    })

    expect(readSessionSettings('99').keyboardLayout).toBe('')
  })

  it('returns defaults and clears the key when the entry is corrupt', () => {
    localStorage.setItem(KEY, '{ not json')

    expect(readSessionSettings('42')).toEqual(DEFAULT_SESSION_XPRA_SETTINGS)
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('returns defaults and clears the key when the entry fails the schema', () => {
    localStorage.setItem(KEY, JSON.stringify({ encoding: 'h264' }))

    expect(readSessionSettings('42')).toEqual(DEFAULT_SESSION_XPRA_SETTINGS)
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('notifies subscribers on write and stops after unsubscribe', () => {
    const listener = jest.fn()
    const unsubscribe = subscribeSessionSettings(listener)

    writeSessionSettings('42', DEFAULT_SESSION_XPRA_SETTINGS)
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    writeSessionSettings('42', DEFAULT_SESSION_XPRA_SETTINGS)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('toXpraParams', () => {
  it('uses the Xpra parameter names, not the CHORUS field names', () => {
    const params = toXpraParams({
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      keyboardLayout: 'ch',
      clipboard: false,
      bandwidthLimit: 10_000_000
    })

    expect(params.keyboard_layout).toBe('ch')
    expect(params.clipboard).toBe('false')
    expect(params.bandwidth_limit).toBe('10000000')
    expect(params.clipboard_preferred_format).toBe('text/plain')
    expect(params.swap_keys).toBe('false')
    expect(params.file_transfer).toBe('true')
    expect(params.sound).toBe('true')
  })

  it('resolves the keyboard layout from the locale when unset', () => {
    const spy = jest
      .spyOn(navigator, 'language', 'get')
      .mockReturnValue('fr-CH')

    expect(toXpraParams(DEFAULT_SESSION_XPRA_SETTINGS).keyboard_layout).toBe(
      'ch'
    )

    spy.mockRestore()
  })

  it('omits the audio codec when the client should pick', () => {
    expect(toXpraParams(DEFAULT_SESSION_XPRA_SETTINGS)).not.toHaveProperty(
      'audio_codec'
    )
  })
})

describe('initParamsKey', () => {
  it('changes when an init setting changes', () => {
    const before = initParamsKey(DEFAULT_SESSION_XPRA_SETTINGS)
    const after = initParamsKey({
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      encoding: 'jpeg'
    })

    expect(after).not.toBe(before)
  })

  it('does not change when only a live setting changes', () => {
    const before = initParamsKey(DEFAULT_SESSION_XPRA_SETTINGS)
    const after = initParamsKey({
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      audio: false,
      onScreenKeyboard: true
    })

    expect(after).toBe(before)
  })
})
