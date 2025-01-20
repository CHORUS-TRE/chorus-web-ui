'use client'

import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'

import { User } from '@/domain/model'

import { userMe } from '../actions/user-view-model'

type AuthContextType = {
  isAuthenticated: boolean
  setAuthenticated: Dispatch<SetStateAction<boolean>>
  user: User | undefined
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  user: undefined,
  refreshUser: async () => {}
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

  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setUser(undefined)
        return
      }

      const me = await userMe()
      setUser(
        me.data
          ? {
              ...me.data,
              workspaceId:
                me.data.workspaceId ||
                process.env.NEXT_PUBLIC_ALBERT_WORKSPACE_ID ||
                localStorage.getItem('NEXT_PUBLIC_ALBERT_WORKSPACE_ID') ||
                undefined
            }
          : undefined
      )
    } catch (error) {
      console.error(error)
    }
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        user,
        refreshUser
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
