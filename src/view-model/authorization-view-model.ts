import { useEffect, useState } from 'react'

import { AuthorizationLocalDataSource } from '@/data/data-source/authorization-local-data-source'
import { AuthorizationRepositoryImpl } from '@/data/repository/authorization-repository-impl'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'

export const useAuthorizationViewModel = () => {
  const { service, isInitialized } = useAuthorization()
  const { user } = useAuthentication()

  const [canCreateWorkspace, setCanCreateWorkspace] = useState(false)

  useEffect(() => {
    if (isInitialized && service && user) {
      const authDataSource = new AuthorizationLocalDataSource(service)
      const authRepo = new AuthorizationRepositoryImpl(authDataSource)
      const result = authRepo.isUserAllowed(user, 'workspaces:create')
      setCanCreateWorkspace(result.data ?? false)
    }
  }, [isInitialized, service, user])

  return {
    canCreateWorkspace
  }
}
