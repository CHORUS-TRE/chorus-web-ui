import { z } from 'zod'

// DevStore keys for instance configuration
export const INSTANCE_CONFIG_KEYS = {
  NAME: 'instance.name',
  HEADLINE: 'instance.headline',
  TAGLINE: 'instance.tagline',
  WEBSITE: 'instance.website',
  TAGS: 'instance.tags',
  LOGO: 'instance.logo',
  THEME: 'instance.theme',
  DEFAULT_THEME_MODE: 'instance.defaultTheme',
  LIMITS: 'instance.limits',
  DISPLAY_PARTICIPATING_CENTERS: 'instance.displayParticipatingCenters'
} as const

// Logo configuration (light and dark variants)
export const InstanceLogoSchema = z.object({
  light: z.string().nullable().optional(),
  dark: z.string().nullable().optional()
})

export type InstanceLogo = z.infer<typeof InstanceLogoSchema>

// Theme color set for a single mode (light or dark)
export const ThemeColorSetSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  muted: z.string().optional(),
  destructive: z.string().optional()
})

export type ThemeColorSet = z.infer<typeof ThemeColorSetSchema>

// Theme configuration with light and dark variants
export const InstanceThemeSchema = z.object({
  light: ThemeColorSetSchema.optional(),
  dark: ThemeColorSetSchema.optional()
})

export type InstanceTheme = z.infer<typeof InstanceThemeSchema>

// Platform-wide default theme mode, seeds next-themes' initial value for
// visitors with no local theme preference of their own
export const ThemeModeSchema = z.enum(['light', 'dark', 'system'])

export type ThemeMode = z.infer<typeof ThemeModeSchema>

export const DEFAULT_THEME_MODE: ThemeMode = 'dark'

// Resource limits per user
export const InstanceLimitsSchema = z.object({
  maxWorkspacesPerUser: z.number().int().min(0).nullable().default(null),
  maxSessionsPerUser: z.number().int().min(0).nullable().default(null),
  maxAppInstancesPerUser: z.number().int().min(0).nullable().default(null)
})

export type InstanceLimits = z.infer<typeof InstanceLimitsSchema>

// Full instance configuration
export const InstanceConfigSchema = z.object({
  name: z.string().default('CHORUS'),
  headline: z
    .string()
    .default(
      'A secure, open-source platform revolutionizing collaborative medical research and AI development.'
    ),
  tagline: z
    .string()
    .default('Your One-Stop Shop for Data, Applications, and AI'),
  website: z.string().default('https://www.chorus-tre.ch/en/'),
  logo: InstanceLogoSchema.nullable().optional(),
  theme: InstanceThemeSchema.nullable().optional(),
  defaultThemeMode: ThemeModeSchema.default(DEFAULT_THEME_MODE),
  limits: InstanceLimitsSchema.nullable().optional(),
  displayParticipatingCenters: z.boolean().default(false)
})

export type InstanceConfig = z.infer<typeof InstanceConfigSchema>

// Default instance configuration
export const DEFAULT_INSTANCE_CONFIG: InstanceConfig = {
  name: 'CHORUS',
  headline:
    'A secure, open-source platform revolutionizing collaborative medical research and AI development.',
  tagline: 'Your One-Stop Shop for Data, Applications, and AI',
  website: 'https://www.chorus-tre.ch/en/',
  logo: null,
  theme: null,
  defaultThemeMode: DEFAULT_THEME_MODE,
  limits: {
    maxWorkspacesPerUser: null,
    maxSessionsPerUser: null,
    maxAppInstancesPerUser: null
  },
  displayParticipatingCenters: false
}
