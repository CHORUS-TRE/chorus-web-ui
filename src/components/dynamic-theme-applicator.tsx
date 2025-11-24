'use client'

import Color from 'color'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

import { useAppState } from '~/providers/app-state-provider'

export const DynamicThemeApplicator = () => {
  const { customTheme } = useAppState()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark') => {
      const root = document.documentElement
      const themeColors = customTheme[theme]

      if (themeColors.primary) {
        const primaryHsl = Color(themeColors.primary).hsl().array()
        root.style.setProperty(
          '--primary',
          `${primaryHsl[0]} ${primaryHsl[1]}% ${primaryHsl[2]}%`
        )
      }
      if (themeColors.secondary) {
        const secondaryHsl = Color(themeColors.secondary).hsl().array()
        root.style.setProperty(
          '--secondary',
          `${secondaryHsl[0]} ${secondaryHsl[1]}% ${secondaryHsl[2]}%`
        )
      }
      if (themeColors.accent) {
        const accentHsl = Color(themeColors.accent).hsl().array()
        root.style.setProperty(
          '--accent',
          `${accentHsl[0]} ${accentHsl[1]}% ${accentHsl[2]}%`
        )
      }
    }

    if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
      applyTheme(resolvedTheme)
    }
  }, [customTheme, resolvedTheme])

  return null
}
