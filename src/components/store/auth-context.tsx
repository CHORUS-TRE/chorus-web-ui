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

type AuthContextType = {
  isAuthenticated: boolean
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {}
})

export const AuthProvider = ({
  children,
  authenticated
}: {
  children: ReactNode
  authenticated: boolean
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(authenticated)

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useIsAuthenticated(): boolean {
  const context = useAuth()
  return context.isAuthenticated
}
