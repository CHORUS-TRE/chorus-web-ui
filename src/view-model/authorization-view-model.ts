'use client'

import { useEffect, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { User } from '~/domain/model/user'

export const useAuthorizationViewModel = () => {
  const { isUserAllowed, isInitialized } = useAuthorization()
  const { user } = useAuthentication()

  const [canCreateWorkspace, setCanCreateWorkspace] = useState(false)
  const [canManageUsers, setCanManageUsers] = useState(false) // PlateformUserManager
  const [canManageSettings, setCanManageSettings] = useState(false) // PlatformSettingsManager
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthorization = async (user: User) => {
      try {
        setCanCreateWorkspace(
          user.rolesWithContext?.find(
            (role) => role.name === 'Authenticated'
          ) !== undefined
        )
        setCanManageUsers(
          user.rolesWithContext?.find(
            (role) =>
              role.name === 'PlateformUserManager' || role.name === 'SuperAdmin'
          ) !== undefined
        )
        setCanManageSettings(
          user.rolesWithContext?.find(
            (role) =>
              role.name === 'PlatformSettingsManager' ||
              role.name === 'SuperAdmin'
          ) !== undefined
        )
      } catch (err) {
        console.error('Error checking user permissions:', err)
        setError('Failed to check permissions. Please try again later.')
      }
    }

    if (!user) {
      setCanCreateWorkspace(false)
      setCanManageUsers(false)
      setCanManageSettings(false)
      return
    }

    if (isInitialized && user) {
      checkAuthorization(user)
    }
  }, [user, isInitialized, isUserAllowed])

  return {
    canCreateWorkspace,
    canManageUsers,
    canManageSettings,
    error
  }
}
