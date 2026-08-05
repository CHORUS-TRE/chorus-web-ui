import { useLayoutEffect, useRef } from 'react'

import { SessionXpraSettings } from '@/domain/model'
import { initParamsKey } from '@/lib/session-settings'

/**
 * Resets a session's "loaded" flag whenever its boot-time Xpra settings change.
 *
 * Changing a boot-time setting changes initParamsKey, which is the React key on
 * the iframe in xpra-web.tsx, so the iframe remounts and the client reconnects.
 * Without this reset the remount happens behind a stale "already loaded" flag and
 * the user sees a blank desktop with no overlay. useLayoutEffect (not useEffect)
 * so the flag flips before the browser paints the remounted iframe.
 */
export function useXpraReconnectReset(
  settings: SessionXpraSettings,
  enabled: boolean,
  onReset: () => void
): void {
  const initKey = initParamsKey(settings)
  const previousInitKeyRef = useRef(initKey)

  useLayoutEffect(() => {
    if (!enabled) return
    if (previousInitKeyRef.current === initKey) return
    previousInitKeyRef.current = initKey
    onReset()
  }, [enabled, initKey, onReset])
}
