'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import { AuthorizationService } from '@/lib/gatekeeper/dist/index.mjs'

// Define the shape of the context
interface AuthorizationContextType {
  service: InstanceType<typeof AuthorizationService> | null // Use InstanceType to reference the instance type
  isInitialized: boolean
  error: Error | null
}

// Create the context with a default value
const AuthorizationContext = createContext<AuthorizationContextType>({
  service: null,
  isInitialized: false,
  error: null
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
  const [service, setService] = useState<InstanceType<
    typeof AuthorizationService
  > | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeService = async () => {
      try {
        // TODO: This schema needs to be fetched or provided correctly.
        // For now, using a placeholder schema.
        interface PlaceholderAuthorizationSchema {
          roles: Array<{
            name: string
            description: string
            permissions: Array<{
              name: string
              description: string
              context: object
            }>
            inheritsFrom: string[]
            attributes: object
          }>
          permissions: Array<object>
        }

        const schema: PlaceholderAuthorizationSchema = {
          roles: [
            {
              name: 'admin',
              description: 'Administrator',
              permissions: [
                { name: '*', description: 'Allow all actions', context: {} }
              ],
              inheritsFrom: [],
              attributes: {}
            },
            {
              name: 'user',
              description: 'Standard User',
              permissions: [
                {
                  name: 'read:own',
                  description: 'Read own resources',
                  context: {}
                }
              ],
              inheritsFrom: [],
              attributes: {}
            }
          ],
          permissions: []
        }

        const authService = await AuthorizationService.init(schema) // Initialize and get the instance
        setService(authService) // Set the initialized instance
        setIsInitialized(true)
      } catch (e) {
        setError(e as Error)
        console.error('Failed to initialize Authorization Service:', e)
      }
    }

    initializeService()
  }, [])
  const value = { service, isInitialized, error }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}
