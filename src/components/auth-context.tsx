'use client'

import React, {
  createContext,
  FunctionComponent,
  ReactElement,
  ReactNode,
  use,
  useContext,
  useEffect,
  useState
} from 'react'

// type AuthContextType = {
//   isLoggedIn: boolean
//   setIsLoggedIn: (isLoggedIn: boolean) => void
// }
// const AuthContext = createContext<AuthContextType | null>(null)
// type AuthProviderProps = {
//   children: ReactNode
// }

type AuthContext = {
  isAuthenticated: boolean
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuthenticated: () => {}
})

export const AuthProvider = ({
  children,
  authenticated
}: {
  children: ReactNode
  authenticated: boolean
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] =
    React.useState<boolean>(authenticated)
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

export function useAuth(): AuthContext {
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
