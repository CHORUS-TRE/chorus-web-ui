'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Hook to manage fullscreen mode for the authenticated app
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const element = document.getElementById('authenticated-app')
    if (!element) return

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error exiting fullscreen:', err)
    }
  }, [])

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen
  }
}
