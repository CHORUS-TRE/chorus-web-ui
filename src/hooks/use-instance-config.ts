'use client'

import { useMemo } from 'react'

import { AppInstanceStatus, WorkbenchStatus } from '@/domain/model'
import {
  DEFAULT_INSTANCE_CONFIG,
  INSTANCE_CONFIG_KEYS,
  InstanceConfig,
  InstanceLimits,
  InstanceLimitsSchema,
  InstanceLogo,
  InstanceLogoSchema,
  InstanceTag,
  InstanceTagSchema
} from '@/domain/model/instance-config'
import { useAppState } from '@/stores/app-state-store'
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
  const limitsRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LIMITS]
  )
  const sidebarWebappsRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.SIDEBAR_WEBAPPS]
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

    // Parse limits (reuse logic from useInstanceLimits for consistency)
    let limits = null
    if (limitsRaw) {
      try {
        limits = JSON.parse(limitsRaw)
      } catch {
        // Keep null
      }
    }

    // Parse sidebar webapps
    let sidebarWebapps: string[] = DEFAULT_INSTANCE_CONFIG.sidebarWebapps
    if (sidebarWebappsRaw) {
      try {
        const parsed = JSON.parse(sidebarWebappsRaw)
        if (
          Array.isArray(parsed) &&
          parsed.every((i) => typeof i === 'string')
        ) {
          sidebarWebapps = parsed
        }
      } catch {
        // Keep default
      }
    }

    return {
      name: nameRaw || DEFAULT_INSTANCE_CONFIG.name,
      headline: headlineRaw || DEFAULT_INSTANCE_CONFIG.headline,
      tagline: taglineRaw || DEFAULT_INSTANCE_CONFIG.tagline,
      website: websiteRaw || DEFAULT_INSTANCE_CONFIG.website,
      tags,
      logo,
      theme,
      limits,
      sidebarWebapps
    }
  }, [
    nameRaw,
    headlineRaw,
    taglineRaw,
    websiteRaw,
    tagsRaw,
    logoRaw,
    themeRaw,
    limitsRaw,
    sidebarWebappsRaw
  ])

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

type ResourceCheck = {
  current: number
  max: number | null
  isAtLimit: boolean
}

type InstanceLimitsResult = {
  limits: InstanceLimits | null
  workspaces: ResourceCheck
  sessions: ResourceCheck
  appInstances: ResourceCheck
}

/**
 * Hook to access instance limits and check resource usage for a user.
 * When userId is provided, computes current counts and isAtLimit flags.
 */
export function useInstanceLimits(userId?: string): InstanceLimitsResult {
  const limitsRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LIMITS]
  )
  const { workspaces, workbenches, appInstances } = useAppState()

  return useMemo((): InstanceLimitsResult => {
    let limits: InstanceLimits | null = null
    if (limitsRaw) {
      try {
        const parsed = JSON.parse(limitsRaw)
        const validated = InstanceLimitsSchema.safeParse(parsed)
        if (validated.success) limits = validated.data
      } catch {
        // Keep null
      }
    }

    const workspaceCount =
      workspaces?.filter((w) => w.userId === userId && w.status !== 'deleted')
        .length ?? 0
    const sessionCount =
      workbenches?.filter(
        (wb) => wb.userId === userId && wb.status !== WorkbenchStatus.DELETED
      ).length ?? 0
    const appInstanceCount =
      appInstances?.filter(
        (ai) => ai.userId === userId && ai.status !== AppInstanceStatus.DELETED
      ).length ?? 0

    return {
      limits,
      workspaces: {
        current: workspaceCount,
        max: limits?.maxWorkspacesPerUser ?? null,
        isAtLimit:
          limits?.maxWorkspacesPerUser != null &&
          workspaceCount >= limits.maxWorkspacesPerUser
      },
      sessions: {
        current: sessionCount,
        max: limits?.maxSessionsPerUser ?? null,
        isAtLimit:
          limits?.maxSessionsPerUser != null &&
          sessionCount >= limits.maxSessionsPerUser
      },
      appInstances: {
        current: appInstanceCount,
        max: limits?.maxAppInstancesPerUser ?? null,
        isAtLimit:
          limits?.maxAppInstancesPerUser != null &&
          appInstanceCount >= limits.maxAppInstancesPerUser
      }
    }
  }, [limitsRaw, workspaces, workbenches, appInstances, userId])
}
