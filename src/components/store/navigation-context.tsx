'use client'

import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'

type NavigationContextType = {
  showRightSidebar: boolean
  toggleRightSidebar: () => void
  showLeftSidebar: boolean
  toggleLeftSidebar: () => void
  showWorkspacesTable: boolean
  toggleWorkspaceView: () => void
  background:
    | {
        workbenchId: string
        workspaceId: string
      }
    | undefined
  setBackground: Dispatch<
    SetStateAction<
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
  showWorkspacesTable: true,
  toggleWorkspaceView: () => {},
  background: undefined,
  setBackground: () => {}
})

export const NavigationProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [showWorkspacesTable, setShowWorkspacesTable] = useState(false)
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
        showWorkspacesTable,
        toggleWorkspaceView: () => setShowWorkspacesTable(!showWorkspacesTable),
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
