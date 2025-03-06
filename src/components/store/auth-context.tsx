'use client'

import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { logout } from '@/components/actions/authentication-view-model'
import { User } from '@/domain/model'

import { userMe } from '../actions/user-view-model'

import { useAppState } from './app-state-context'

type AuthContextType = {
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  user: User | undefined
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  user: undefined
})

export const AuthProvider = ({
  children,
  authenticated,
  initialUser
}: {
  children: ReactNode
  authenticated: boolean
  initialUser?: User
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(authenticated)
  const [user, setUser] = useState<User | undefined>(initialUser)
  const refreshInterval = useRef<NodeJS.Timeout>()

  const { setBackground } = useAppState()

  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setUser(undefined)
        return
      }

      const { data, error } = await userMe()
      if (error) throw error

      setUser(data)
    } catch (error) {
      console.error(error)
      setBackground(undefined)
      setAuthenticated(false)
      logout().then(() => {
        window.location.href = '/'
      })
    }
  }, [isAuthenticated, setBackground, setAuthenticated])

  useEffect(() => {
    if (isAuthenticated && !refreshInterval.current) {
      // Initial refresh if we don't have a user
      if (!user) {
        refreshUser()
      }

      // Set up periodic refresh
      refreshInterval.current = setInterval(refreshUser, 30 * 1000)
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current)
        refreshInterval.current = undefined
      }
    }
  }, [isAuthenticated, refreshUser, user])

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
