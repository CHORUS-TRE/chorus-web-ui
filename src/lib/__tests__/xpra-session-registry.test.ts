import type { XpraWebHandle } from '@/components/xpra-web'
import {
  focusXpraApp,
  getXpraSessionInfo,
  hasXpraBridge,
  registerXpraSession,
  setXpraAudio,
  uploadXpraFile
} from '@/lib/xpra-session-registry'

function fakeHandle(): jest.Mocked<XpraWebHandle> {
  return {
    listWindows: jest.fn(() => []),
    focusWindow: jest.fn(() => false),
    resize: jest.fn(),
    focus: jest.fn(),
    setAudio: jest.fn(),
    setKeyboard: jest.fn(),
    uploadFile: jest.fn(),
    downloadFile: jest.fn(),
    getSessionInfo: jest.fn(() => undefined),
    reconnect: jest.fn()
  } as unknown as jest.Mocked<XpraWebHandle>
}

describe('xpra session registry', () => {
  it('forwards a live setting to the registered handle', () => {
    const handle = fakeHandle()
    const unregister = registerXpraSession('42', handle)

    setXpraAudio('42', false)

    expect(handle.setAudio).toHaveBeenCalledWith(false)
    unregister()
  })

  it('forwards an action to the registered handle', () => {
    const handle = fakeHandle()
    const unregister = registerXpraSession('42', handle)

    uploadXpraFile('42')

    expect(handle.uploadFile).toHaveBeenCalled()
    unregister()
  })

  it('is a silent no-op for an unknown session', () => {
    expect(() => setXpraAudio('does-not-exist', true)).not.toThrow()
    expect(getXpraSessionInfo('does-not-exist')).toBeUndefined()
  })

  it('reports whether a bridge is available', () => {
    expect(hasXpraBridge('42')).toBe(false)

    const unregister = registerXpraSession('42', fakeHandle())
    expect(hasXpraBridge('42')).toBe(true)

    unregister()
    expect(hasXpraBridge('42')).toBe(false)
  })
})

describe('focusXpraApp', () => {
  it('matches on the app name candidate', () => {
    const handle = fakeHandle()
    handle.listWindows.mockReturnValue([
      { id: 7, title: 'Firefox', appId: 'firefox', minimized: false }
    ])
    handle.focusWindow.mockReturnValue(true)
    const unregister = registerXpraSession('42', handle)

    const focused = focusXpraApp('42', ['Firefox', 'catalog-id-123'])

    expect(focused).toBe(true)
    expect(handle.focusWindow).toHaveBeenCalledWith(7)
    unregister()
  })

  it('falls back to the docker image base name when name candidates miss', () => {
    const handle = fakeHandle()
    handle.listWindows.mockReturnValue([
      {
        id: 29,
        title: 'my-project',
        appId: 'my-custom-binary',
        minimized: false
      }
    ])
    handle.focusWindow.mockReturnValue(true)
    const unregister = registerXpraSession('42', handle)

    const focused = focusXpraApp(
      '42',
      ['Custom App', 'catalog-id-570'],
      'registry.example.com/apps/my-custom-binary:latest'
    )

    expect(focused).toBe(true)
    expect(handle.focusWindow).toHaveBeenCalledWith(29)
    unregister()
  })

  it.each([
    ['kitty', 'Robex'],
    ['pcmanfm-qt', 'File Manager']
  ])('falls back to the known alias for appId %s', (appId, catalogName) => {
    const handle = fakeHandle()
    handle.listWindows.mockReturnValue([
      { id: 29, title: 'my-project', appId, minimized: false }
    ])
    handle.focusWindow.mockReturnValue(true)
    const unregister = registerXpraSession('42', handle)

    const focused = focusXpraApp('42', [catalogName, 'catalog-id-570'])

    expect(focused).toBe(true)
    expect(handle.focusWindow).toHaveBeenCalledWith(29)
    unregister()
  })

  it('returns false when neither the candidates, the image name, nor a known alias match', () => {
    const handle = fakeHandle()
    handle.listWindows.mockReturnValue([
      {
        id: 29,
        title: 'my-project',
        appId: 'totally-unrelated-binary',
        minimized: false
      }
    ])
    const unregister = registerXpraSession('42', handle)

    const focused = focusXpraApp(
      '42',
      ['File Manager', 'catalog-id-570'],
      'registry.example.com/apps/filemanager:latest'
    )

    expect(focused).toBe(false)
    expect(handle.focusWindow).not.toHaveBeenCalled()
    unregister()
  })
})
