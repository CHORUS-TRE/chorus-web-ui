'use client'

import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { User } from '@/domain/model'

import { userMe } from '../actions/user-view-model'

type AuthContextType = {
  isAuthenticated: boolean
  setAuthenticated: Dispatch<SetStateAction<boolean>>
  user: User | undefined
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  user: undefined
})

export const AuthProvider = ({
  children,
  authenticated
}: {
  children: ReactNode
  authenticated: boolean
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(authenticated)
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [isAuthenticated])

  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        console.log('AuthProvider: clearing user due to not authenticated')
        setUser(undefined)
        return
      }

      const me = await userMe()
      setUser(me.data)
    } catch (error) {
      console.error(error)
    }
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        user
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
