import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { XpraWeb, XpraWebHandle } from '@/components/xpra-web'
import { DEFAULT_SESSION_XPRA_SETTINGS } from '@/domain/model'

const STREAM_URL =
  'https://backend.example.com/api/rest/v1/workbenches/42/stream/'

// jest.setup.js mocks next-runtime-env's env() onto process.env.
function setClientSource(value?: 'local' | 'remote') {
  if (value === undefined) delete process.env.NEXT_PUBLIC_XPRA_CLIENT
  else process.env.NEXT_PUBLIC_XPRA_CLIENT = value
}

describe('XpraWeb', () => {
  const original = process.env.NEXT_PUBLIC_XPRA_CLIENT

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_XPRA_CLIENT
    else process.env.NEXT_PUBLIC_XPRA_CLIENT = original
  })

  describe("with NEXT_PUBLIC_XPRA_CLIENT='local'", () => {
    it('embeds the vendored client with the stream endpoint as query params', () => {
      setClientSource('local')
      render(<XpraWeb streamUrl={STREAM_URL} title="Session" />)

      const src = screen.getByTitle('Session').getAttribute('src') ?? ''
      const [path, query] = src.split('?')
      const params = new URLSearchParams(query)

      expect(path).toBe('/vendor/xpra/index.html')
      expect(params.get('server')).toBe('backend.example.com')
      expect(params.get('port')).toBe('443')
      expect(params.get('ssl')).toBe('true')
      expect(params.get('path')).toBe('/api/rest/v1/workbenches/42/stream/')
      expect(params.get('embedded')).toBe('true')
    })

    it('does not report connected before the client says so', () => {
      setClientSource('local')
      const onConnected = jest.fn()
      render(
        <XpraWeb
          streamUrl={STREAM_URL}
          title="Session"
          onConnected={onConnected}
        />
      )

      fireEvent.load(screen.getByTitle('Session'))

      expect(onConnected).not.toHaveBeenCalled()
    })
  })

  describe("with NEXT_PUBLIC_XPRA_CLIENT unset (default 'remote')", () => {
    it('embeds the stream URL directly', () => {
      setClientSource(undefined)
      render(<XpraWeb streamUrl={STREAM_URL} title="Session" />)

      expect(screen.getByTitle('Session')).toHaveAttribute('src', STREAM_URL)
    })

    it('reports connected once the iframe finishes loading', () => {
      setClientSource(undefined)
      const onConnected = jest.fn()
      const onDisconnected = jest.fn()
      render(
        <XpraWeb
          streamUrl={STREAM_URL}
          title="Session"
          onConnected={onConnected}
          onDisconnected={onDisconnected}
        />
      )

      fireEvent.load(screen.getByTitle('Session'))

      expect(onConnected).toHaveBeenCalledTimes(1)
      expect(onDisconnected).not.toHaveBeenCalled()
    })

    it('exposes a bridge-less handle: no windows, focus requests refused', () => {
      setClientSource(undefined)
      const ref = createRef<XpraWebHandle>()
      render(<XpraWeb ref={ref} streamUrl={STREAM_URL} title="Session" />)

      expect(ref.current?.listWindows()).toEqual([])
      expect(ref.current?.focusWindow(1)).toBe(false)
      expect(() => ref.current?.resize()).not.toThrow()
      expect(() => ref.current?.focus()).not.toThrow()
    })
  })

  describe('with session settings', () => {
    const settings = {
      ...DEFAULT_SESSION_XPRA_SETTINGS,
      keyboardLayout: 'ch',
      clipboard: false,
      encoding: 'jpeg' as const
    }

    it('passes them to the vendored client as query params', () => {
      setClientSource('local')
      render(
        <XpraWeb streamUrl={STREAM_URL} title="Session" settings={settings} />
      )

      const src = screen.getByTitle('Session').getAttribute('src') ?? ''
      const params = new URLSearchParams(src.split('?')[1])

      expect(params.get('keyboard_layout')).toBe('ch')
      expect(params.get('clipboard')).toBe('false')
      expect(params.get('encoding')).toBe('jpeg')
      // the connection params must survive
      expect(params.get('server')).toBe('backend.example.com')
    })

    it('passes them to the pod-served client too', () => {
      setClientSource('remote')
      render(
        <XpraWeb streamUrl={STREAM_URL} title="Session" settings={settings} />
      )

      const src = screen.getByTitle('Session').getAttribute('src') ?? ''
      const params = new URLSearchParams(src.split('?')[1])

      expect(src.startsWith(STREAM_URL)).toBe(true)
      expect(params.get('keyboard_layout')).toBe('ch')
    })

    it('preserves an existing query string on the pod-served client byte-for-byte', () => {
      setClientSource('remote')
      const streamUrlWithQuery =
        'https://backend.example.com/api/rest/v1/workbenches/42/stream/?token=a%20b&x=1'
      render(
        <XpraWeb
          streamUrl={streamUrlWithQuery}
          title="Session"
          settings={settings}
        />
      )

      const src = screen.getByTitle('Session').getAttribute('src') ?? ''

      // Asserted on the raw string, not parsed URLSearchParams, so a
      // parse/reserialize round-trip (which would turn %20 into + and may
      // reorder or re-encode params) would be caught.
      expect(src).toContain('token=a%20b&x=1')
      expect(src).toContain('keyboard_layout=ch')
    })

    it('remounts the iframe when an init setting changes', () => {
      setClientSource('local')
      const { rerender } = render(
        <XpraWeb streamUrl={STREAM_URL} title="Session" settings={settings} />
      )
      const before = screen.getByTitle('Session')

      rerender(
        <XpraWeb
          streamUrl={STREAM_URL}
          title="Session"
          settings={{ ...settings, encoding: 'png' }}
        />
      )

      expect(screen.getByTitle('Session')).not.toBe(before)
    })

    it('keeps the same iframe when only a live setting changes', () => {
      setClientSource('local')
      const { rerender } = render(
        <XpraWeb streamUrl={STREAM_URL} title="Session" settings={settings} />
      )
      const before = screen.getByTitle('Session')

      rerender(
        <XpraWeb
          streamUrl={STREAM_URL}
          title="Session"
          settings={{ ...settings, audio: false, onScreenKeyboard: true }}
        />
      )

      expect(screen.getByTitle('Session')).toBe(before)
    })

    it('does not change the iframe src when only a live setting changes', () => {
      setClientSource('local')
      const { rerender } = render(
        <XpraWeb streamUrl={STREAM_URL} title="Session" settings={settings} />
      )
      const srcBefore = screen.getByTitle('Session').getAttribute('src')

      rerender(
        <XpraWeb
          streamUrl={STREAM_URL}
          title="Session"
          settings={{ ...settings, audio: false, onScreenKeyboard: true }}
        />
      )

      expect(screen.getByTitle('Session').getAttribute('src')).toBe(srcBefore)
    })
  })

  describe('the extended handle in remote mode', () => {
    it('degrades every bridge method instead of throwing', () => {
      setClientSource('remote')
      const ref = createRef<XpraWebHandle>()
      render(<XpraWeb ref={ref} streamUrl={STREAM_URL} title="Session" />)

      expect(() => ref.current?.setAudio(true)).not.toThrow()
      expect(() => ref.current?.setKeyboard(true)).not.toThrow()
      expect(() => ref.current?.uploadFile()).not.toThrow()
      expect(() => ref.current?.downloadFile()).not.toThrow()
      expect(() => ref.current?.reconnect()).not.toThrow()
      expect(ref.current?.getSessionInfo()).toBeUndefined()
    })
  })
})
