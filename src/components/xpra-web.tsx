'use client'

import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'

import { SessionXpraSettings } from '@/domain/model'
import { xpraClientSource } from '@/lib/feature-flags'
import { initParamsKey, toXpraParams } from '@/lib/session-settings'

export type XpraWindow = {
  id: number
  title: string
  appId: string
  minimized: boolean
}

export type XpraSessionInfo = {
  endpoint: string
  display: string
  platform: string
  connectedSince: string
}

type XpraBridge = {
  listWindows: () => XpraWindow[]
  focusWindow: (windowId: number) => boolean
  resize: () => void
  setAudio: (enabled: boolean) => void
  setKeyboard: (visible: boolean) => void
  uploadFile: () => void
  downloadFile: () => void
  getSessionInfo: () => XpraSessionInfo | undefined
  reconnect: () => void
}

type XpraFrameWindow = Window & {
  chorusXpra?: XpraBridge
}

export type XpraWebHandle = XpraBridge & {
  focus: () => void
}

type XpraWebProps = {
  streamUrl: string
  title: string
  className?: string
  style?: CSSProperties
  settings?: SessionXpraSettings
  onConnected?: () => void
  onDisconnected?: (reason: string) => void
}

function applySettings(
  params: URLSearchParams,
  settings: SessionXpraSettings | undefined
): void {
  if (!settings) return
  for (const [key, value] of Object.entries(toXpraParams(settings))) {
    params.set(key, value)
  }
}

function buildClientUrl(
  streamUrl: string,
  settings: SessionXpraSettings | undefined
): string {
  const endpoint = new URL(streamUrl, window.location.href)
  const params = new URLSearchParams(endpoint.search)

  params.set('server', endpoint.hostname)
  params.set(
    'port',
    endpoint.port || (endpoint.protocol === 'https:' ? '443' : '80')
  )
  params.set('ssl', String(endpoint.protocol === 'https:'))
  params.set('path', endpoint.pathname)
  params.set('embedded', 'true')
  applySettings(params, settings)

  return `/vendor/xpra/index.html?${params.toString()}`
}

// The pod-served client is the same upstream index.html and reads the same
// query params, so the init-time settings apply there too — only the
// chorusXpra bridge is unavailable cross-origin. streamUrl is preserved
// byte-for-byte (no parse/reserialize round-trip) since it may one day carry
// a token or other query param that must not be re-encoded or reordered.
function buildRemoteUrl(
  streamUrl: string,
  settings: SessionXpraSettings | undefined
): string {
  if (!settings) return streamUrl
  const query = new URLSearchParams(toXpraParams(settings)).toString()
  const separator = streamUrl.includes('?') ? '&' : '?'
  return `${streamUrl}${separator}${query}`
}

export const XpraWeb = forwardRef<XpraWebHandle, XpraWebProps>(function XpraWeb(
  { streamUrl, title, className, style, settings, onConnected, onDisconnected },
  forwardedRef
) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // 'local' embeds the vendored client (same origin, chorusXpra bridge);
  // 'remote' embeds the client served by the session pod (cross-origin, no bridge).
  const isLocalClient = xpraClientSource() === 'local'
  // Init-time settings can only be applied while the client boots, so changing
  // one has to remount the iframe. Live settings are excluded on purpose.
  const remountKey = useMemo(
    () => (settings ? initParamsKey(settings) : 'default'),
    [settings]
  )

  // Keyed on remountKey, not settings: `key={remountKey}` below only gives the
  // iframe a new DOM node when an init setting changes, so a live-only change
  // (e.g. toggling on-screen keyboard) must not recompute `src` either —
  // changing `src` on the existing node makes the browser reload it even
  // though React never remounted it, defeating the live setting entirely.
  // Live settings apply through the chorusXpra bridge instead (setKeyboard/
  // setAudio in the imperative handle below), never through the URL after boot.
  const clientUrl = useMemo(
    () =>
      isLocalClient
        ? buildClientUrl(streamUrl, settings)
        : buildRemoteUrl(streamUrl, settings),
    // settings is intentionally excluded, see comment above
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLocalClient, streamUrl, remountKey]
  )

  const getBridge = useCallback(() => {
    // Reaching into contentWindow throws a SecurityError on the cross-origin
    // remote client, so never even look there.
    if (!isLocalClient) return undefined
    return (iframeRef.current?.contentWindow as XpraFrameWindow | null)
      ?.chorusXpra
  }, [isLocalClient])

  useImperativeHandle(
    forwardedRef,
    () => ({
      listWindows: () => getBridge()?.listWindows() ?? [],
      focusWindow: (windowId) => getBridge()?.focusWindow(windowId) ?? false,
      resize: () => getBridge()?.resize(),
      setAudio: (enabled) => getBridge()?.setAudio(enabled),
      setKeyboard: (visible) => {
        const bridge = getBridge()
        console.log('[osk] 3. XpraWebHandle.setKeyboard', {
          visible,
          hasBridge: Boolean(bridge)
        })
        return bridge?.setKeyboard(visible)
      },
      uploadFile: () => getBridge()?.uploadFile(),
      downloadFile: () => getBridge()?.downloadFile(),
      getSessionInfo: () => getBridge()?.getSessionInfo(),
      reconnect: () => getBridge()?.reconnect(),
      focus: () => iframeRef.current?.focus()
    }),
    [getBridge]
  )

  useEffect(() => {
    // Only the vendored client posts these; the remote one reports readiness
    // through the iframe's own load event instead.
    if (!isLocalClient) return

    const handleMessage = (event: MessageEvent) => {
      const data =
        typeof event.data === 'object' && event.data !== null
          ? (event.data as Record<string, unknown>)
          : null
      if (
        event.origin === window.location.origin &&
        event.source === iframeRef.current?.contentWindow &&
        data?.source === 'chorus-xpra' &&
        data.type === 'connected'
      ) {
        onConnected?.()
      } else if (
        event.origin === window.location.origin &&
        event.source === iframeRef.current?.contentWindow &&
        data?.source === 'chorus-xpra' &&
        data.type === 'disconnected'
      ) {
        const detail =
          typeof data.detail === 'object' && data.detail !== null
            ? (data.detail as Record<string, unknown>)
            : null
        onDisconnected?.(
          typeof detail?.reason === 'string'
            ? detail.reason
            : 'Connection closed'
        )
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isLocalClient, onConnected, onDisconnected])

  return (
    <div className={className} style={{ ...style, overflow: 'hidden' }}>
      <iframe
        key={remountKey}
        ref={iframeRef}
        src={clientUrl}
        title={title}
        style={{ width: '100%', height: '100%', border: 0 }}
        allow="autoplay; fullscreen; clipboard-write; clipboard-read;"
        onLoad={isLocalClient ? undefined : () => onConnected?.()}
        onMouseOver={() => iframeRef.current?.focus()}
      />
    </div>
  )
})
