'use client'

import React, { createContext, useContext } from 'react'

import { useFullscreen } from '@/hooks/use-fullscreen'

interface FullscreenContextType {
  isFullscreen: boolean
  toggleFullscreen: () => Promise<void>
  exitFullscreen: () => Promise<void>
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(
  undefined
)

export function FullscreenProvider({
  children
}: {
  children: React.ReactNode
}) {
  const fullscreenState = useFullscreen()

  return (
    <FullscreenContext.Provider value={fullscreenState}>
      {children}
    </FullscreenContext.Provider>
  )
}

export function useFullscreenContext() {
  const context = useContext(FullscreenContext)
  if (context === undefined) {
    throw new Error(
      'useFullscreenContext must be used within a FullscreenProvider'
    )
  }
  return context
}
