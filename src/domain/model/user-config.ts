import { z } from 'zod'

// DevStore keys for user configuration
export const USER_CONFIG_KEYS = {
  COOKIE_CONSENT: 'user.cookie_consent'
} as const

// Cookie consent configuration
export const CookieConsentSchema = z.object({
  accepted: z.boolean().nullable(),
  timestamp: z.string().optional()
})

export type CookieConsent = z.infer<typeof CookieConsentSchema>
