import { useEffect, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { User } from '~/domain/model/user'

export const useAuthorizationViewModel = () => {
  const { isUserAllowed, isInitialized } = useAuthorization()
  const { user } = useAuthentication()

  const [canCreateWorkspace, setCanCreateWorkspace] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthorization = async (user: User) => {
      try {
        // const result = await isUserAllowed(user, permission)
        const result = user.rolesWithContext?.find(
          (role) => role.name === 'SuperAdmin'
        )

        if (result) {
          setCanCreateWorkspace(true)
        } else {
          setCanCreateWorkspace(false)
        }
      } catch (err) {
        console.error('Error checking user permissions:', err)
        setError('Failed to check permissions. Please try again later.')
      }
    }

    if (!user) {
      setCanCreateWorkspace(false)
      return
    }

    if (isInitialized && user) {
      checkAuthorization(user)
    }
  }, [user, isInitialized, isUserAllowed])

  return {
    canCreateWorkspace,
    error
  }
}
