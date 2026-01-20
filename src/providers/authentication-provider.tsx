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

import { LoadingOverlay } from '@/components/loading-overlay'
import { Result, User } from '@/domain/model'
import { login, logout } from '@/view-model/authentication-view-model'
import { userMe } from '@/view-model/user-view-model'
import { workspaceList } from '@/view-model/workspace-view-model'

type AuthContextType = {
  user: User | undefined
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
  login: (prevState: Result<User>, formData: FormData) => Promise<Result<User>>
}

const AuthenticationContext = createContext<AuthContextType>({
  user: undefined,
  refreshUser: async () => {},
  logout: async () => {},
  login: async () => {
    return { data: undefined, error: undefined }
  }
})

export const AuthenticationProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)
  const refreshInterval = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleLogout = useCallback(async () => {
    if (user) {
      await logout()
    }
    setTimeout(() => {
      setIsLoading(false)
      setUser(undefined)
    }, 300)
    // Note: IframeCacheProvider automatically clears cache when user becomes undefined
  }, [user])

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
    <AuthenticationContext.Provider
      value={{ user, login: handleLogin, logout: handleLogout, refreshUser }}
    >
      {isLoading ? <LoadingOverlay isLoading={isLoading} /> : children}
    </AuthenticationContext.Provider>
  )
}

export function useAuthentication(): AuthContextType {
  const context = useContext(AuthenticationContext)
  if (context === undefined) {
    throw new Error(
      'useAuthentication must be used within an AuthenticationProvider'
    )
  }
  return context
}
