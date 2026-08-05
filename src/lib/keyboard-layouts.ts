import { SessionXpraSettings, Workbench } from '@/domain/model'

// Browser locale -> Xpra keyboard layout code. Covers the locales CHUV sees;
// everything else falls back to 'us'. Region wins over language: a French
// speaker in Switzerland needs the Swiss layout, not the French one.
const REGION_LAYOUTS: Record<string, string> = {
  CH: 'ch',
  FR: 'fr',
  DE: 'de',
  AT: 'de',
  IT: 'it',
  GB: 'gb',
  US: 'us',
  ES: 'es',
  PT: 'pt',
  BE: 'be',
  NL: 'nl'
}

const LANGUAGE_LAYOUTS: Record<string, string> = {
  fr: 'fr',
  de: 'de',
  it: 'it',
  es: 'es',
  pt: 'pt',
  nl: 'nl',
  en: 'us'
}

export function layoutFromLocale(locale: string): string {
  const [language, region] = locale.split('-')
  if (region && REGION_LAYOUTS[region.toUpperCase()]) {
    return REGION_LAYOUTS[region.toUpperCase()]
  }
  return LANGUAGE_LAYOUTS[(language || '').toLowerCase()] || 'us'
}

/**
 * Precedence: backend field (does not exist yet — REQ-XPRA-002) -> the user's
 * explicit choice -> the browser locale. When the CRD gains a keyboard layout,
 * this function is the only place that changes.
 */
export function resolveKeyboardLayout(
  _workbench: Workbench | undefined,
  settings: SessionXpraSettings
): string {
  if (settings.keyboardLayout) return settings.keyboardLayout
  return layoutFromLocale(
    typeof navigator === 'undefined' ? '' : navigator.language
  )
}
