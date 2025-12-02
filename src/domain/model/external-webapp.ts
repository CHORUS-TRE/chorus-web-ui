import { z } from 'zod'

/**
 * Schema for external web applications that can be loaded in iframes.
 * These are configured by admins and stored in DevStore with key 'external_webapps'.
 */
export const ExternalWebAppSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (val) => /^https?:\/\/.+/.test(val),
      'Must be a valid HTTP or HTTPS URL'
    ),
  description: z.string().optional(),
  iconUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        /^https?:\/\/.+/.test(val) ||
        /^data:image\/[a-zA-Z]+;base64,/.test(val),
      'Must be a valid URL or base64 image'
    )
    .optional()
})

export type ExternalWebApp = z.infer<typeof ExternalWebAppSchema>

export const ExternalWebAppsArraySchema = z.array(ExternalWebAppSchema)

export type ExternalWebAppsArray = z.infer<typeof ExternalWebAppsArraySchema>

/**
 * Schema for cached iframe entries (both sessions and webapps).
 */
export const CachedIframeSchema = z.object({
  id: z.string(),
  type: z.enum(['session', 'webapp']),
  url: z.string(),
  name: z.string(),
  workspaceId: z.string().optional(),
  lastAccessed: z.date()
})

export type CachedIframe = z.infer<typeof CachedIframeSchema>

export type IframeType = 'session' | 'webapp'
