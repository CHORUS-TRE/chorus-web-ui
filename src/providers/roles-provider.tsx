'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { AuthorizationRole } from '@/domain/model/authorization'
import { useAuthentication } from '@/providers/authentication-provider'
import { listRoles } from '@/view-model/authorization-view-model'

interface RolesContextType {
  roles: AuthorizationRole[]
  rolesByName: Map<string, AuthorizationRole>
}

const RolesContext = createContext<RolesContextType>({
  roles: [],
  rolesByName: new Map()
})

export const useRoles = (): RolesContextType => {
  const ctx = useContext(RolesContext)
  if (!ctx) {
    throw new Error('useRoles must be used within a RolesProvider')
  }
  return ctx
}

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthentication()
  const [roles, setRoles] = useState<AuthorizationRole[]>([])
  const [loading, setLoading] = useState(!!user)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      // Unauthenticated — do not block; login page renders without roles
      setLoading(false)
      return
    }

    let ignored = false
    setLoading(true)
    setError(null)

    listRoles().then((result) => {
      if (ignored) return
      if (result.error) {
        setError(result.error)
      } else {
        setRoles(result.data ?? [])
      }
      setLoading(false)
    })

    return () => {
      ignored = true
    }
  }, [user])

  const rolesByName = useMemo(
    () => new Map(roles.map((r) => [r.name, r])),
    [roles]
  )

  if (loading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load roles: {error}</p>
          <button
            className="mt-4 text-sm underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <RolesContext.Provider value={{ roles, rolesByName }}>
      {children}
    </RolesContext.Provider>
  )
}
