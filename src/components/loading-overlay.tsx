'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  delay?: number
  dismiss?: boolean
}

export function LoadingOverlay({
  isLoading,
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
      <div className="justify-cente flex flex-col items-center gap-4">
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
        {/* <p className="text-white">{message}</p> */}
      </div>
    </div>
  )
}
