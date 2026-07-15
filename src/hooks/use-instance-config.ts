'use client'

import { useMemo } from 'react'

import { AppInstanceStatus, WorkbenchStatus } from '@/domain/model'
import {
  DEFAULT_INSTANCE_CONFIG,
  DEFAULT_THEME_MODE,
  INSTANCE_CONFIG_KEYS,
  InstanceConfig,
  InstanceLimits,
  InstanceLimitsSchema,
  InstanceLogo,
  InstanceLogoSchema,
  ThemeMode,
  ThemeModeSchema
} from '@/domain/model/instance-config'
import { WorkspaceState } from '@/domain/model/workspace'
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
  const logoRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LOGO]
  )
  const themeRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.THEME]
  )
  const limitsRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.LIMITS]
  )
  const defaultThemeModeRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.DEFAULT_THEME_MODE]
  )
  const displayParticipatingCentersRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.DISPLAY_PARTICIPATING_CENTERS]
  )

  // Memoize the parsed config
  const config = useMemo((): InstanceConfig => {
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

    // Parse displayParticipatingCenters
    let displayParticipatingCenters =
      DEFAULT_INSTANCE_CONFIG.displayParticipatingCenters
    if (displayParticipatingCentersRaw) {
      try {
        displayParticipatingCenters =
          JSON.parse(displayParticipatingCentersRaw) === true
      } catch {
        // Keep default
      }
    }

    // Parse defaultThemeMode
    let defaultThemeMode = DEFAULT_THEME_MODE
    if (defaultThemeModeRaw) {
      const validated = ThemeModeSchema.safeParse(defaultThemeModeRaw)
      if (validated.success) defaultThemeMode = validated.data
    }

    return {
      name: nameRaw || DEFAULT_INSTANCE_CONFIG.name,
      headline: headlineRaw || DEFAULT_INSTANCE_CONFIG.headline,
      tagline: taglineRaw || DEFAULT_INSTANCE_CONFIG.tagline,
      website: websiteRaw || DEFAULT_INSTANCE_CONFIG.website,
      logo,
      theme,
      limits,
      defaultThemeMode,
      displayParticipatingCenters
    }
  }, [
    nameRaw,
    headlineRaw,
    taglineRaw,
    websiteRaw,
    logoRaw,
    themeRaw,
    limitsRaw,
    defaultThemeModeRaw,
    displayParticipatingCentersRaw
  ])

  return config
}

/**
 * Hook to access whether the Participating Centers section should be shown
 */
export function useDisplayParticipatingCenters(): boolean {
  const displayParticipatingCentersRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.DISPLAY_PARTICIPATING_CENTERS]
  )

  return useMemo(() => {
    if (!displayParticipatingCentersRaw)
      return DEFAULT_INSTANCE_CONFIG.displayParticipatingCenters
    try {
      return JSON.parse(displayParticipatingCentersRaw) === true
    } catch {
      return DEFAULT_INSTANCE_CONFIG.displayParticipatingCenters
    }
  }, [displayParticipatingCentersRaw])
}

/**
 * Hook to access the platform's default theme mode (light/dark/system)
 */
export function useInstanceDefaultThemeMode(): ThemeMode {
  const defaultThemeModeRaw = useDevStoreCache(
    (state) => state.global[INSTANCE_CONFIG_KEYS.DEFAULT_THEME_MODE]
  )

  return useMemo(() => {
    if (!defaultThemeModeRaw) return DEFAULT_THEME_MODE
    const validated = ThemeModeSchema.safeParse(defaultThemeModeRaw)
    return validated.success ? validated.data : DEFAULT_THEME_MODE
  }, [defaultThemeModeRaw])
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
      workspaces?.filter(
        (w) => w.userId === userId && w.status !== WorkspaceState.DELETED
      ).length ?? 0
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
