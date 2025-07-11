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

import { login, logout } from '@/components/actions/authentication-view-model'
import { Result, User } from '@/domain/model'

import { userMe } from '../actions/user-view-model'
import { workspaceList } from '../actions/workspace-view-model'
import { LoadingOverlay } from '../loading-overlay'
import { useAppState } from './app-state-context'

type AuthContextType = {
  user: User | undefined
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
  login: (prevState: Result<User>, formData: FormData) => Promise<Result<User>>
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  refreshUser: async () => {},
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

  const handleLogout = useCallback(async () => {
    if (user) {
      await logout()
    }
    setIsLoading(false)
    setBackground(undefined)
    setUser(undefined)
  }, [setBackground, user])

  const refreshUser = useCallback(async () => {
    try {
      const userResult = await userMe()
      if (!userResult?.data) throw new Error('Failed to get user')

      let nextUser = userResult.data
      const workspaces = await workspaceList()
      const isMain = workspaces?.data?.find(
        (w) => w.isMain && w.userId === nextUser.id
      )
      if (isMain) {
        nextUser = { ...nextUser, workspaceId: isMain.id }
      }

      setUser(nextUser)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      handleLogout()
    }
  }, [setUser, handleLogout])

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
      await refreshUser()

      return {
        ...prevState,
        data: user
      }
    }

    return {
      ...prevState,
      error: 'Failed to retrieve user information'
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, logout: handleLogout, refreshUser }}
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
