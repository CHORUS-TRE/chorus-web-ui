'use client'

import { useMemo } from 'react'

import {
  INSTANCE_CONFIG_KEYS,
  InstanceTheme,
  InstanceThemeSchema
} from '@/domain/model/instance-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

// Default theme colors
const DEFAULT_THEME = {
  light: {
    primary: '#1340FF',
    secondary: '#CDCBFA',
    accent: '#B7FF13'
  },
  dark: {
    primary: '#1340FF',
    secondary: '#CDCBFA',
    accent: '#B7FF13'
  }
}

export type ThemeColors = {
  light: { primary: string; secondary: string; accent: string }
  dark: { primary: string; secondary: string; accent: string }
}

/**
 * Hook to safely access the instance theme from DevStore cache.
 * Uses memoization to avoid infinite loops caused by object reference changes.
 *
 * @returns The parsed theme with defaults applied
 */
export function useInstanceTheme(): ThemeColors {
  // Subscribe to the raw theme string to avoid infinite loop
  const instanceThemeRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.THEME]
  )

  // Memoize the parsed theme to avoid re-parsing on every render
  const theme = useMemo((): ThemeColors => {
    if (!instanceThemeRaw) return DEFAULT_THEME

    try {
      const parsed = JSON.parse(instanceThemeRaw)
      const validated = InstanceThemeSchema.safeParse(parsed)
      if (validated.success) {
        // Merge with defaults to ensure all fields exist
        return {
          light: {
            primary:
              validated.data.light?.primary || DEFAULT_THEME.light.primary,
            secondary:
              validated.data.light?.secondary || DEFAULT_THEME.light.secondary,
            accent: validated.data.light?.accent || DEFAULT_THEME.light.accent
          },
          dark: {
            primary: validated.data.dark?.primary || DEFAULT_THEME.dark.primary,
            secondary:
              validated.data.dark?.secondary || DEFAULT_THEME.dark.secondary,
            accent: validated.data.dark?.accent || DEFAULT_THEME.dark.accent
          }
        }
      }
      return DEFAULT_THEME
    } catch {
      return DEFAULT_THEME
    }
  }, [instanceThemeRaw])

  return theme
}

/**
 * Get the default theme (for use outside of React components)
 */
export function getDefaultTheme(): ThemeColors {
  return DEFAULT_THEME
}
