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

import {
  getToken,
  login,
  logout
} from '@/components/actions/authentication-view-model'
import { Result, User } from '@/domain/model'

import { userMe } from '../actions/user-view-model'
import { LoadingOverlay } from '../loading-overlay'
import { useAppState } from './app-state-context'

type AuthContextType = {
  user: User | undefined
  logout: () => Promise<void>
  login: (prevState: Result<User>, formData: FormData) => Promise<Result<User>>
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  logout: async () => {},
  login: async () => {
    return { data: undefined, error: undefined }
  }
})

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)
  const refreshInterval = useRef<NodeJS.Timeout | undefined>(undefined)
  const { setBackground } = useAppState()

  const handleLogin = async (
    prevState: Result<User>,
    formData: FormData
  ): Promise<Result<User>> => {
    // Convert to the expected type for the authentication view model
    const authState: Result<string> = {
      data: undefined,
      error: prevState.error,
      issues: prevState.issues
    }

    const result = await login(authState, formData)

    if (result.error) {
      return {
        ...prevState,
        error: result.error
      }
    }

    if (result.data) {
      const user = await userMe()
      if (user?.data) {
        setUser(user.data)
        return {
          ...prevState,
          data: user.data,
          error: undefined
        }
      }
    }

    return {
      ...prevState,
      error: 'Failed to retrieve user information'
    }
  }

  const handleLogout = useCallback(async () => {
    await logout()
    setBackground(undefined)
    sessionStorage.removeItem('token')
    setUser(undefined)
  }, [setBackground])

  const refreshUser = useCallback(async () => {
    const token = await getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const userResult = await userMe()
      if (!userResult?.data) throw new Error('Failed to get user')

      if (user?.id !== userResult.data?.id) {
        setUser(userResult.data)
      }

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      handleLogout()
    }
  }, [user, handleLogout])

  useEffect(() => {
    if (!user) {
      refreshUser()
    }

    // Set up periodic refresh
    refreshInterval.current = setInterval(refreshUser, 30 * 1000)

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current)
        refreshInterval.current = undefined
      }
    }
  }, [user, refreshUser])

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, logout: handleLogout }}
    >
      {isLoading ? <LoadingOverlay isLoading={isLoading} /> : children}
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
