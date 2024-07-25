'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent
} from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  setAuthentication: (token: string) => void
  clearAuthentication: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

// Provides authentication context to child components
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // Set the user's token and update login status
  const setAuthentication = (token: string) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
  }

  // Remove the user's token and update login status
  const clearAuthentication = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setAuthentication, clearAuthentication }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')

  return context
}
