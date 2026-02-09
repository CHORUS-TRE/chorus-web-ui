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
  LIMITS: 'instance.limits'
} as const

// Tag configuration for workspace types
export const InstanceTagSchema = z.object({
  id: z.string(),
  label: z.string(),
  display: z.boolean().default(true)
})

export type InstanceTag = z.infer<typeof InstanceTagSchema>

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
  tags: z.array(InstanceTagSchema).default([
    { id: 'project', label: 'Workspace', display: true },
    { id: 'center', label: 'Center', display: true }
  ]),
  logo: InstanceLogoSchema.nullable().optional(),
  theme: InstanceThemeSchema.nullable().optional(),
  limits: InstanceLimitsSchema.nullable().optional()
})

export type InstanceConfig = z.infer<typeof InstanceConfigSchema>

// Default instance configuration
export const DEFAULT_INSTANCE_CONFIG: InstanceConfig = {
  name: 'CHORUS',
  headline:
    'A secure, open-source platform revolutionizing collaborative medical research and AI development.',
  tagline: 'Your One-Stop Shop for Data, Applications, and AI',
  website: 'https://www.chorus-tre.ch/en/',
  tags: [
    { id: 'project', label: 'Workspace', display: true },
    { id: 'center', label: 'Center', display: true }
  ],
  logo: null,
  theme: null,
  limits: {
    maxWorkspacesPerUser: null,
    maxSessionsPerUser: null,
    maxAppInstancesPerUser: null
  }
}
