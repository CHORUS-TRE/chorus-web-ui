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

import { xpraClientSource } from '@/lib/feature-flags'

export type XpraWindow = {
  id: number
  title: string
  appId: string
  minimized: boolean
}

type XpraBridge = {
  listWindows: () => XpraWindow[]
  focusWindow: (windowId: number) => boolean
  resize: () => void
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
  onConnected?: () => void
  onDisconnected?: (reason: string) => void
}

function buildClientUrl(streamUrl: string): string {
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

  return `/vendor/xpra/index.html?${params.toString()}`
}

export const XpraWeb = forwardRef<XpraWebHandle, XpraWebProps>(function XpraWeb(
  { streamUrl, title, className, style, onConnected, onDisconnected },
  forwardedRef
) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // 'local' embeds the vendored client (same origin, chorusXpra bridge);
  // 'remote' embeds the client served by the session pod (cross-origin, no bridge).
  const isLocalClient = xpraClientSource() === 'local'
  const clientUrl = useMemo(
    () => (isLocalClient ? buildClientUrl(streamUrl) : streamUrl),
    [isLocalClient, streamUrl]
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
