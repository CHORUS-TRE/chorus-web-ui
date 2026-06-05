'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import { User } from '@/domain/model/user'
import { useAuthentication } from '@/providers/authentication-provider'
import { useRoles } from '@/providers/roles-provider'

interface AuthorizationContextType {
  can: (permission: string, context?: Record<string, string>) => boolean
  getPermissionsForUser: (
    user: User,
    context?: Record<string, string>
  ) => Set<string>
  isAdmin: boolean
}

const AuthorizationContext = createContext<AuthorizationContextType>({
  can: () => false,
  getPermissionsForUser: () => new Set<string>(),
  isAdmin: false
})

export const useAuthorization = () => {
  const context = useContext(AuthorizationContext)
  if (!context) {
    throw new Error(
      'useAuthorization must be used within an AuthorizationProvider'
    )
  }
  return context
}

export const AuthorizationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuthentication()
  const { rolesByName } = useRoles()

  const permissionsWithContextMap = useMemo(() => {
    if (!user || !user.rolesWithContext)
      return new Map<string, Record<string, string[]>>()

    const newPermissionsMap: Record<string, Record<string, string[]>> = {}

    user.rolesWithContext.forEach((role) => {
      const permissions = rolesByName.get(role.name)?.permissions ?? []

      permissions.forEach((permission) => {
        if (!newPermissionsMap[permission]) {
          newPermissionsMap[permission] = {}
        }

        const permContext = newPermissionsMap[permission]

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
  }, [user, rolesByName])

  const can = useCallback(
    (permission: string, context: Record<string, string> = {}) => {
      if (!permissionsWithContextMap.has(permission)) return false

      const allowedContexts = permissionsWithContextMap.get(permission)!

      if (Object.keys(context).length === 0) return true

      return Object.entries(context).every(([key, value]) => {
        const allowedValues = allowedContexts[key]
        if (!allowedValues || allowedValues.length === 0) return false
        return allowedValues.includes('*') || allowedValues.includes(value)
      })
    },
    [permissionsWithContextMap]
  )

  const getPermissionsForUser = useCallback(
    (user: User, context: Record<string, string> = {}) => {
      const permissions = new Set<string>()
      if (!user || !user.rolesWithContext) return permissions

      user.rolesWithContext.forEach((role) => {
        const contextMatches = Object.entries(context).every(
          ([key, value]) => role.context?.[key] === value
        )

        if (contextMatches) {
          const rolePermissions = rolesByName.get(role.name)?.permissions ?? []
          rolePermissions.forEach((p) => permissions.add(p))
        }
      })

      return permissions
    },
    [rolesByName]
  )

  const isAdmin = useMemo(() => {
    if (!user || !user.rolesWithContext) return false
    return (
      can('listWorkspaces', { workspace: '*' }) ||
      can('listUsers', { workspace: '*' }) ||
      can('listWorkbenchs', { workspace: '*' }) ||
      can('createApp', {}) ||
      can('setPlatformSettings', {})
    )
  }, [user, can])

  return (
    <AuthorizationContext.Provider
      value={{ can, getPermissionsForUser, isAdmin }}
    >
      {children}
    </AuthorizationContext.Provider>
  )
}
