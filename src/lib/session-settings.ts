import {
  DEFAULT_SESSION_XPRA_SETTINGS,
  INIT_SETTING_KEYS,
  SessionXpraSettings,
  SessionXpraSettingsSchema,
  Workbench
} from '@/domain/model'
import { resolveKeyboardLayout } from '@/lib/keyboard-layouts'

const STORAGE_PREFIX = 'chorus.session-settings.v1.'

const storageKey = (sessionId: string) => `${STORAGE_PREFIX}${sessionId}`

const listeners = new Set<() => void>()

export function subscribeSessionSettings(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function readSessionSettings(sessionId: string): SessionXpraSettings {
  if (typeof window === 'undefined') return DEFAULT_SESSION_XPRA_SETTINGS

  const raw = window.localStorage.getItem(storageKey(sessionId))
  if (!raw) return DEFAULT_SESSION_XPRA_SETTINGS

  try {
    const parsed = SessionXpraSettingsSchema.safeParse(JSON.parse(raw))
    if (parsed.success) return parsed.data
  } catch {
    // fall through — a corrupt entry must never stop a session from opening
  }

  window.localStorage.removeItem(storageKey(sessionId))
  return DEFAULT_SESSION_XPRA_SETTINGS
}

export function writeSessionSettings(
  sessionId: string,
  settings: SessionXpraSettings
): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey(sessionId), JSON.stringify(settings))
  }
  listeners.forEach((listener) => listener())
}

// CHORUS field name -> Xpra client parameter name (index.html:648-698).
export function toXpraParams(
  settings: SessionXpraSettings,
  workbench?: Workbench
): Record<string, string> {
  const params: Record<string, string> = {
    keyboard_layout: resolveKeyboardLayout(workbench, settings),
    keyboard: String(settings.onScreenKeyboard),
    clipboard: String(settings.clipboard),
    clipboard_preferred_format: settings.clipboardFormat,
    swap_keys: String(settings.swapKeys),
    encoding: settings.encoding,
    offscreen: String(settings.offscreen),
    bandwidth_limit: String(settings.bandwidthLimit),
    file_transfer: String(settings.fileTransfer),
    printing: String(settings.printing),
    sound: String(settings.audio)
  }

  if (settings.audioCodec) params.audio_codec = settings.audioCodec

  return params
}

// Identity of the settings that can only be applied at client boot. Used as a
// React key: when it changes, the iframe remounts and the client reconnects.
export function initParamsKey(settings: SessionXpraSettings): string {
  return INIT_SETTING_KEYS.map((key) => `${key}=${settings[key]}`).join('&')
}
