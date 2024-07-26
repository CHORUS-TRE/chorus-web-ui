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
  setSession: () => void
  clearSession: () => void
}
const AuthContext = createContext<AuthContextType | null>(null)
type AuthProviderProps = {
  children: ReactNode
}

// Provides authentication dummy context to child components
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage?.getItem('session') ? true : false
  )

  const setSession = () => {
    localStorage.setItem('session', 'yeap')
    setIsLoggedIn(true)
  }

  const clearSession = () => {
    localStorage.removeItem('session')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setSession, clearSession }}>
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
