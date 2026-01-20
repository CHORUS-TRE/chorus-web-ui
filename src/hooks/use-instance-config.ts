'use client'

import { useMemo } from 'react'

import {
  DEFAULT_INSTANCE_CONFIG,
  INSTANCE_CONFIG_KEYS,
  InstanceConfig,
  InstanceLogo,
  InstanceLogoSchema,
  InstanceTag,
  InstanceTagSchema
} from '@/domain/model/instance-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

/**
 * Hook to safely access the full instance configuration from DevStore cache.
 * Uses memoization to avoid infinite loops caused by object reference changes.
 *
 * @returns The parsed instance config with defaults applied
 */
export function useInstanceConfig(): InstanceConfig {
  // Subscribe to raw values from the cache
  const nameRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.NAME]
  )
  const headlineRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.HEADLINE]
  )
  const taglineRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.TAGLINE]
  )
  const websiteRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.WEBSITE]
  )
  const tagsRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.TAGS]
  )
  const logoRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LOGO]
  )
  const themeRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.THEME]
  )

  // Memoize the parsed config
  const config = useMemo((): InstanceConfig => {
    // Parse tags
    let tags: InstanceTag[] = DEFAULT_INSTANCE_CONFIG.tags
    if (tagsRaw) {
      try {
        const parsed = JSON.parse(tagsRaw)
        const validated = InstanceTagSchema.array().safeParse(parsed)
        if (validated.success) {
          tags = validated.data
        }
      } catch {
        // Keep default
      }
    }

    // Parse logo
    let logo: InstanceLogo | null = null
    if (logoRaw) {
      try {
        const parsed = JSON.parse(logoRaw)
        const validated = InstanceLogoSchema.safeParse(parsed)
        if (validated.success) {
          logo = validated.data
        }
      } catch {
        // Keep null
      }
    }

    // Parse theme (reuse logic from useInstanceTheme for consistency)
    let theme = null
    if (themeRaw) {
      try {
        theme = JSON.parse(themeRaw)
      } catch {
        // Keep null
      }
    }

    return {
      name: nameRaw || DEFAULT_INSTANCE_CONFIG.name,
      headline: headlineRaw || DEFAULT_INSTANCE_CONFIG.headline,
      tagline: taglineRaw || DEFAULT_INSTANCE_CONFIG.tagline,
      website: websiteRaw || DEFAULT_INSTANCE_CONFIG.website,
      tags,
      logo,
      theme
    }
  }, [nameRaw, headlineRaw, taglineRaw, websiteRaw, tagsRaw, logoRaw, themeRaw])

  return config
}

/**
 * Hook to access just the instance logo
 */
export function useInstanceLogo(): InstanceLogo | null {
  const logoRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LOGO]
  )

  return useMemo((): InstanceLogo | null => {
    if (!logoRaw) return null
    try {
      const parsed = JSON.parse(logoRaw)
      const validated = InstanceLogoSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
      return null
    } catch {
      return null
    }
  }, [logoRaw])
}
