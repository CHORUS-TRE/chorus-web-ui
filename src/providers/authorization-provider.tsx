'use client'

import React, { createContext, useContext, useMemo } from 'react'

import { PERMISSIONS, ROLE_DEFINITIONS } from '@/config/permissions'
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

// Helper to resolve all permissions for a specific role definition (handling inheritance)
const resolveRolePermissions = (
  roleName: string,
  cache: Map<string, string[]> = new Map()
): string[] => {
  if (cache.has(roleName)) return cache.get(roleName)!

  const roleDef = ROLE_DEFINITIONS[roleName]
  if (!roleDef) {
    console.warn(`Role ${roleName} not found in definitions`)
    return []
  }

  let permissions = [...roleDef.permissions]

  if (roleDef.inheritsFrom) {
    for (const parentRole of roleDef.inheritsFrom) {
      const parentPermissions = resolveRolePermissions(parentRole, cache)
      permissions = [...permissions, ...parentPermissions]
    }
  }

  // Deduplicate
  const uniquePermissions = Array.from(new Set(permissions))
  cache.set(roleName, uniquePermissions)
  return uniquePermissions
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
    const cache = new Map<string, string[]>()

    user.rolesWithContext.forEach((role) => {
      // Resolve permissions for this role
      const permissions = resolveRolePermissions(role.name, cache)

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

      // If the permission doesn't have this context key recorded, it usually means
      // the role didn't specify it.
      // If the role context was empty, it might mean global access depending on convention.
      // But based on our transform, we only add keys that exist.
      // If a dimension is missing in allowedValues, we deny access to it to be safe,
      // unless we decide missing means "*" (global).
      // Given the user example showed explicit "*", we assume explicit is required.

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
      can(PERMISSIONS.listApps, {}) ||
      can(PERMISSIONS.setPlatformSettings, {})
    )
  }, [user, permissionsWithContextMap])

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
