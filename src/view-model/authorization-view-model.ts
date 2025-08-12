import { useEffect, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'

export const useAuthorizationViewModel = () => {
  const { isUserAllowed, isInitialized } = useAuthorization()
  const { user } = useAuthentication()

  const [canCreateWorkspace, setCanCreateWorkspace] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setCanCreateWorkspace(false)
      return
    }

    const checkAuthorization = async () => {
      try {
        if (isInitialized && user) {
          // await service.initializeWasm()
          // const authDataSource = new AuthorizationLocalDataSource(service)
          // const authRepo = new AuthorizationRepositoryImpl(authDataSource)
          // Ensure the service is initialized
          const result = await isUserAllowed(user, 'workspaces:create')
          console.log('User permissions:', result)
          if (result.error) {
            setError(result.error)
          } else {
            console.log('User is allowed to create workspace:', result.data)
            setCanCreateWorkspace(result.data ?? false)
          }
        }
      } catch (err) {
        console.error('Error checking user permissions:', err)
        setError('Failed to check permissions. Please try again later.')
      }
    }

    checkAuthorization()
  }, [isUserAllowed, user, isInitialized])

  return {
    canCreateWorkspace,
    error
  }
}
