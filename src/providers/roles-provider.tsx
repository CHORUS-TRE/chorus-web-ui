'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import {
  AuthorizationPermission,
  AuthorizationRole
} from '@/domain/model/authorization'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  listPermissions,
  listRoles
} from '@/view-model/authorization-view-model'

interface RolesContextType {
  roles: AuthorizationRole[]
  rolesByName: Map<string, AuthorizationRole>
  permissions: AuthorizationPermission[]
  permissionsByName: Map<string, AuthorizationPermission>
  availableScopes: string[]
}

const RolesContext = createContext<RolesContextType>({
  roles: [],
  rolesByName: new Map(),
  permissions: [],
  permissionsByName: new Map(),
  availableScopes: []
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
  const [permissions, setPermissions] = useState<AuthorizationPermission[]>([])
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

    Promise.all([listRoles(), listPermissions()]).then(
      ([rolesResult, permissionsResult]) => {
        if (ignored) return
        if (rolesResult.error) {
          setError(rolesResult.error)
        } else if (permissionsResult.error) {
          setError(permissionsResult.error)
        } else {
          setRoles(rolesResult.data ?? [])
          setPermissions(permissionsResult.data ?? [])
        }
        setLoading(false)
      }
    )

    return () => {
      ignored = true
    }
  }, [user])

  const rolesByName = useMemo(
    () => new Map(roles.map((r) => [r.name, r])),
    [roles]
  )

  const permissionsByName = useMemo(
    () => new Map(permissions.map((p) => [p.name, p])),
    [permissions]
  )

  const availableScopes = useMemo(() => {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const role of roles) {
      if (role.scope && !seen.has(role.scope)) {
        seen.add(role.scope)
        ordered.push(role.scope)
      }
    }
    return ordered
  }, [roles])

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
    <RolesContext.Provider
      value={{
        roles,
        rolesByName,
        permissions,
        permissionsByName,
        availableScopes
      }}
    >
      {children}
    </RolesContext.Provider>
  )
}
