'use client'

import React, { createContext, useContext, useMemo } from 'react'

import { getRolePermissions, PERMISSIONS } from '@/config/permissions'
import { useAuthentication } from '@/providers/authentication-provider'

// Define the shape of the context
interface AuthorizationContextType {
  PERMISSIONS: typeof PERMISSIONS
  can: (permission: string, context?: Record<string, string>) => boolean
  isAdmin: boolean
}

// Create the context with a default value
const AuthorizationContext = createContext<AuthorizationContextType>({
  PERMISSIONS,
  can: (permission: string, context?: Record<string, string>) => false,
  isAdmin: false
})

// Create a custom hook for easy access to the context
export const useAuthorization = () => {
  const context = useContext(AuthorizationContext)
  if (!context) {
    throw new Error(
      'useAuthorization must be used within an AuthorizationProvider'
    )
  }
  return context
}

// Define the provider component
export const AuthorizationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuthentication()
  const permissionsWithContextMap = useMemo(() => {
    if (!user || !user.rolesWithContext)
      return new Map<string, Record<string, string[]>>()

    const newPermissionsMap: Record<string, Record<string, string[]>> = {}

    user.rolesWithContext.forEach((role) => {
      // Resolve permissions for this role
      const permissions = getRolePermissions(role.name)

      permissions.forEach((permission) => {
        if (!newPermissionsMap[permission]) {
          newPermissionsMap[permission] = {}
        }

        const permContext = newPermissionsMap[permission]

        // Merge role context into permission context
        Object.entries(role.context).forEach(([key, value]) => {
          if (!permContext[key]) {
            permContext[key] = []
          }

          if (!permContext[key].includes(value)) {
            permContext[key].push(value)
          }
        })
      })
    })

    return new Map(Object.entries(newPermissionsMap))
  }, [user])

  const can = (permission: string, context: Record<string, string> = {}) => {
    if (!permissionsWithContextMap.has(permission)) return false

    const allowedContexts = permissionsWithContextMap.get(permission)!

    // If no context constraints in request, and user has the permission (with any context), allow.
    // NOTE: This assumes having the permission implies *some* access.
    if (Object.keys(context).length === 0) return true

    // Check request context against allowedContexts
    return Object.entries(context).every(([key, value]) => {
      const allowedValues = allowedContexts[key]

      // If the permission doesn't have this context key recorded, it usually means the role didn't specify it.
      // If the role context was empty, it might mean global access depending on convention.
      // But based on our transform, we only add keys that exist.
      // If a dimension is missing in allowedValues, we deny access to it to be safe,
      // unless we decide missing means "*" (global).
      // We assume explicit is required.

      if (!allowedValues || allowedValues.length === 0) return false

      return allowedValues.includes('*') || allowedValues.includes(value)
    })
  }

  // Set admin state
  const isAdmin = useMemo(() => {
    if (!user || !user.rolesWithContext) return false
    return (
      can(PERMISSIONS.listWorkspaces, { workspace: '*' }) ||
      can(PERMISSIONS.listUsers, { workspace: '*' }) ||
      can(PERMISSIONS.listWorkbenches, { workspace: '*' }) ||
      can(PERMISSIONS.createApp, {}) ||
      can(PERMISSIONS.setPlatformSettings, {})
    )
  }, [user, permissionsWithContextMap])

  console.log(permissionsWithContextMap)

  const value = {
    PERMISSIONS,
    can,
    isAdmin
  }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}
