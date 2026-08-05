'use client'

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

import {
  DEFAULT_SESSION_XPRA_SETTINGS,
  SessionXpraSettings
} from '@/domain/model'
import {
  readSessionSettings,
  subscribeSessionSettings,
  writeSessionSettings
} from '@/lib/session-settings'

export function useSessionSettings(sessionId: string) {
  // useSyncExternalStore requires a referentially stable snapshot: reading
  // localStorage on every call would return a new object and loop forever.
  const cache = useRef<{ raw: string; value: SessionXpraSettings } | null>(null)

  const getSnapshot = useCallback(() => {
    const value = readSessionSettings(sessionId)
    const raw = JSON.stringify(value)
    if (!cache.current || cache.current.raw !== raw) {
      cache.current = { raw, value }
    }
    return cache.current.value
  }, [sessionId])

  const settings = useSyncExternalStore(
    subscribeSessionSettings,
    getSnapshot,
    () => DEFAULT_SESSION_XPRA_SETTINGS
  )

  const update = useCallback(
    (patch: Partial<SessionXpraSettings>) => {
      writeSessionSettings(sessionId, {
        ...readSessionSettings(sessionId),
        ...patch
      })
    },
    [sessionId]
  )

  return useMemo(() => ({ settings, update }), [settings, update])
}
