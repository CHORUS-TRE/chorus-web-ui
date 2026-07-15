'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import { useInstanceDefaultThemeMode } from '@/hooks/use-instance-config'

const THEME_STORAGE_KEY = 'theme'

/**
 * Seeds next-themes' initial value from the instance-wide default theme
 * mode for visitors who have never chosen a theme themselves. Runs once,
 * after instance config has loaded (mounted inside InstanceConfigInitializer),
 * and only when next-themes has no persisted local preference yet.
 */
export const InstanceDefaultThemeApplicator = () => {
  const defaultThemeMode = useInstanceDefaultThemeMode()
  const { setTheme } = useTheme()
  const hasAppliedRef = useRef(false)

  useEffect(() => {
    if (hasAppliedRef.current) return
    hasAppliedRef.current = true

    const hasUserPreference =
      window.localStorage.getItem(THEME_STORAGE_KEY) !== null
    if (!hasUserPreference) {
      setTheme(defaultThemeMode)
    }
  }, [defaultThemeMode, setTheme])

  return null
}
