'use client'

import React, { createContext, useContext, useState } from 'react'

type NavigationContextType = {
  showRightSidebar: boolean
  toggleRightSidebar: () => void
  showLeftSidebar: boolean
  toggleLeftSidebar: () => void
  background:
    | {
        workbenchId: string
        workspaceId: string
      }
    | undefined
  setBackground: React.Dispatch<
    React.SetStateAction<
      | {
          workbenchId: string
          workspaceId: string
        }
      | undefined
    >
  >
}

const NavigationContext = createContext<NavigationContextType>({
  showRightSidebar: false,
  toggleRightSidebar: () => {},
  showLeftSidebar: false,
  toggleLeftSidebar: () => {},
  background: undefined,
  setBackground: () => {}
})

export const NavigationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [background, setBackground] = useState<{
    workbenchId: string
    workspaceId: string
  }>()

  return (
    <NavigationContext.Provider
      value={{
        showRightSidebar,
        toggleRightSidebar: () => {
          setShowRightSidebar(!showRightSidebar)
        },
        showLeftSidebar,
        toggleLeftSidebar: () => setShowLeftSidebar(!showLeftSidebar),
        background,
        setBackground
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within an NavigationProvider')
  }
  return context
}
