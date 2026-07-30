import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { XpraWeb, XpraWebHandle } from '@/components/xpra-web'

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
})
