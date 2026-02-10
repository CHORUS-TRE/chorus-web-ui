'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import logo from '@/public/logo-chorus-primaire-white@2x.svg'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  delay?: number
  variant?: 'page' | 'container'
}

export function LoadingOverlay({
  isLoading,
  message,
  delay = 500,
  variant = 'page'
}: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

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
  }, [isLoading, delay])

  if (!isVisible) return null

  const containerClassName =
    variant === 'container'
      ? 'absolute inset-0 z-[25] flex items-center justify-center bg-background'
      : 'fixed inset-0 top-11 z-[30] flex items-center justify-center bg-background'

  return (
    <div className={containerClassName} role="status" aria-label="Loading">
      <div className="flex flex-col items-start justify-start gap-4">
        <div className="animate-pulse bg-transparent">
          <Image
            src={logo}
            alt="Chorus"
            height={64}
            className="aspect-auto"
            id="logo"
            priority
          />
        </div>
        <p className="max-w-md text-sm text-muted">{message}</p>
      </div>
    </div>
  )
}
