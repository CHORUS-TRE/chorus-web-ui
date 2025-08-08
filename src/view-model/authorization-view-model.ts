import { useEffect, useState } from 'react'

import { AuthorizationLocalDataSource } from '@/data/data-source/authorization-local-data-source'
import { AuthorizationRepositoryImpl } from '@/data/repository/authorization-repository-impl'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'

export const useAuthorizationViewModel = () => {
  const { service, isInitialized } = useAuthorization()
  const { user } = useAuthentication()

  const [canCreateWorkspace, setCanCreateWorkspace] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isInitialized && service && user) {
      try {
        const authDataSource = new AuthorizationLocalDataSource(service)
        const authRepo = new AuthorizationRepositoryImpl(authDataSource)
        const result = authRepo.isUserAllowed(user, 'workspaces:create')
        setCanCreateWorkspace(result.data ?? false)
      } catch (err) {
        console.error('Error checking user permissions:', err)
        setError('Failed to check permissions. Please try again later.')
      }
    }
  }, [isInitialized, service, user])

  return {
    canCreateWorkspace,
    error
  }
}
