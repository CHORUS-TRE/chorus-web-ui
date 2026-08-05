import {
  DEFAULT_SESSION_XPRA_SETTINGS,
  ENCODING_OPTIONS,
  INIT_SETTING_KEYS,
  KEYBOARD_LAYOUT_OPTIONS,
  SessionXpraSettingsSchema
} from '@/domain/model/session-settings'

describe('SessionXpraSettingsSchema', () => {
  it('fills every field from an empty object', () => {
    const parsed = SessionXpraSettingsSchema.parse({})
    expect(parsed).toEqual(DEFAULT_SESSION_XPRA_SETTINGS)
  })

  it('defaults to an empty layout so the locale can decide', () => {
    expect(DEFAULT_SESSION_XPRA_SETTINGS.keyboardLayout).toBe('')
  })

  it('keeps the Xpra defaults for clipboard, file transfer and audio', () => {
    expect(DEFAULT_SESSION_XPRA_SETTINGS.clipboard).toBe(true)
    expect(DEFAULT_SESSION_XPRA_SETTINGS.fileTransfer).toBe(true)
    expect(DEFAULT_SESSION_XPRA_SETTINGS.audio).toBe(true)
  })

  it('rejects an unknown encoding', () => {
    expect(
      SessionXpraSettingsSchema.safeParse({ encoding: 'h264' }).success
    ).toBe(false)
  })

  it('rejects a negative bandwidth limit', () => {
    expect(
      SessionXpraSettingsSchema.safeParse({ bandwidthLimit: -1 }).success
    ).toBe(false)
  })

  it('treats every setting except the two live ones as init-time', () => {
    expect(INIT_SETTING_KEYS).not.toContain('onScreenKeyboard')
    expect(INIT_SETTING_KEYS).not.toContain('audio')
    expect(INIT_SETTING_KEYS).toContain('keyboardLayout')
    expect(INIT_SETTING_KEYS).toContain('clipboard')
    expect(INIT_SETTING_KEYS).toHaveLength(10)
  })

  it('offers the layouts CHUV actually needs', () => {
    const values = KEYBOARD_LAYOUT_OPTIONS.map((o) => o.value)
    expect(values).toEqual(expect.arrayContaining(['ch', 'fr', 'de', 'us']))
  })

  it('offers the encodings the vendor client accepts', () => {
    expect(ENCODING_OPTIONS.map((o) => o.value)).toEqual([
      'auto',
      'webp',
      'jpeg',
      'png',
      'rgb'
    ])
  })
})
