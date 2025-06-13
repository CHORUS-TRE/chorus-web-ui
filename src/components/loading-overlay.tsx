'use client'

import { useEffect, useState } from 'react'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  delay?: number
  dismiss?: boolean
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  delay = 500,
  dismiss = false
}: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (dismiss) {
      setIsVisible(false)
      return
    }

    if (isLoading) {
      setIsVisible(true)
    } else {
      timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, delay)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay, dismiss])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  )
}
