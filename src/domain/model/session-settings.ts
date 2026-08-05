import { z } from 'zod'

// Xpra client options CHORUS exposes. Field names are CHORUS-side; the mapping
// to the client's own parameter names lives in src/lib/session-settings.ts.
export const SessionXpraSettingsSchema = z.object({
  // '' means "decide from the browser locale" — see resolveKeyboardLayout().
  keyboardLayout: z.string().default(''),
  onScreenKeyboard: z.boolean().default(false),
  clipboard: z.boolean().default(true),
  clipboardFormat: z
    .enum(['text/plain', 'UTF8_STRING', 'text/html'])
    .default('text/plain'),
  swapKeys: z.boolean().default(false),
  encoding: z.enum(['auto', 'webp', 'jpeg', 'png', 'rgb']).default('auto'),
  offscreen: z.boolean().default(true),
  bandwidthLimit: z.number().int().nonnegative().default(0),
  fileTransfer: z.boolean().default(true),
  printing: z.boolean().default(true),
  audio: z.boolean().default(true),
  // '' means "let the client pick" — the vendor fills this list at runtime.
  audioCodec: z.string().default('')
})

export type SessionXpraSettings = z.infer<typeof SessionXpraSettingsSchema>

export const DEFAULT_SESSION_XPRA_SETTINGS: SessionXpraSettings =
  SessionXpraSettingsSchema.parse({})

// Read once when the Xpra client boots; changing one requires a reconnect.
// Everything not listed here is applied live through the chorusXpra bridge.
export const INIT_SETTING_KEYS = [
  'keyboardLayout',
  'clipboard',
  'clipboardFormat',
  'swapKeys',
  'encoding',
  'offscreen',
  'bandwidthLimit',
  'fileTransfer',
  'printing',
  'audioCodec'
] as const satisfies readonly (keyof SessionXpraSettings)[]

// Values taken verbatim from public/vendor/xpra/connect.html so no new mapping
// has to be kept in sync with the client.
export const KEYBOARD_LAYOUT_OPTIONS = [
  { value: 'ch', label: 'Switzerland' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'us', label: 'English (USA)' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'es', label: 'Spain' },
  { value: 'pt', label: 'Portugal' },
  { value: 'be', label: 'Belgium' },
  { value: 'nl', label: 'Netherlands' }
] as const

export const ENCODING_OPTIONS = [
  { value: 'auto', label: 'Automatic' },
  { value: 'webp', label: 'WebP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'rgb', label: 'Raw RGB' }
] as const

export const BANDWIDTH_OPTIONS = [
  { value: 0, label: 'No limit' },
  { value: 100_000_000, label: '100 Mbps' },
  { value: 10_000_000, label: '10 Mbps' },
  { value: 1_000_000, label: '1 Mbps' }
] as const

export const CLIPBOARD_FORMAT_OPTIONS = [
  { value: 'text/plain', label: 'Plain text' },
  { value: 'UTF8_STRING', label: 'UTF-8' },
  { value: 'text/html', label: 'HTML' }
] as const
