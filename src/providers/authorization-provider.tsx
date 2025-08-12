'use client'

import React, { createContext, useContext, useEffect } from 'react'

import type { User } from '@/domain/model/user'
import { Result } from '~/domain/model'

declare global {
  class Go {
    importObject: WebAssembly.Imports
    run(instance: WebAssembly.Instance): Promise<void>
  }
  // function createAuthenticationService(user: User): any;
  // function isUserAllowed(user: User, permission: string): Result<boolean>;
  // function getUserPermissions(user: User): Result<string[]>;
}

// Define the shape of the context
interface AuthorizationContextType {
  isUserAllowed: (user: User, permission: string) => Promise<Result<boolean>>
  getUserPermissions: (user: User) => Result<string[]>
  isInitialized: boolean
  service?: unknown
  error?: string
}

// Create the context with a default value
const AuthorizationContext = createContext<AuthorizationContextType>({
  isUserAllowed: async () => ({ data: false }),
  getUserPermissions: () => ({ data: [] }),
  isInitialized: false,
  service: undefined,
  error: undefined
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
  useEffect(() => {
    async function loadWasm() {
      if (typeof window !== 'undefined') {
        const wasmExec = document.createElement('script')
        wasmExec.src = '/wasm_exec.js' // Place wasm_exec.js in your public folder
        wasmExec.async = true

        await new Promise((resolve) => {
          wasmExec.onload = resolve
          document.head.appendChild(wasmExec)
        })

        const go = new (window as unknown as { Go: typeof Go }).Go()
        WebAssembly.instantiateStreaming(
          fetch('/gatekeeper.wasm'),
          go.importObject
        ).then((result) => {
          const wasm = result.instance
          go.run(wasm)

          console.log('WASM run successfully', wasm.exports)

          const user = {
            roles: [
              {
                name: 'admin',
                description: 'Administrator role',
                permissions: [
                  {
                    name: 'read:users',
                    description: 'Can read user data',
                    context: {}
                  }
                ],
                inheritsFrom: [],
                attributes: {}
              }
            ]
          }
          const NewAuthorizationService = wasm.exports
            .NewAuthorizationService as CallableFunction
          // global.isUserAllowed = (user: User, permission: string) => {
          // console.log('isUserAllowed called with:', user, permission)
          try {
            const service = NewAuthorizationService(user)
            const toto = service.isUserAllowed(user, 'workspace:create')
            console.log('isUserAllowed result:', toto)

            return { data: toto }
          } catch (error) {
            return { error: String(error) }
          }
          // }

          // console.log("Authentication service created")
        })
      }
    }

    loadWasm()
  }, [])

  const isUserAllowed = async (user: User, permission: string): Promise<Result<boolean>> => {
    try {
      // Mock implementation for now
      console.log('isUserAllowed called with:', permission)
      const isAllowed = user.roles2?.some(role => role.name === 'admin') ?? false
      return { data: isAllowed }
    } catch (error) {
      return { error: String(error) }
    }
  }

  const getUserPermissions = (user: User): Result<string[]> => {
    try {
      // Mock implementation for now
      if (user.roles2?.some(role => role.name === 'admin')) {
        return { data: ['admin:roles:read', 'admin:users:read', 'admin:workspaces:read'] }
      }
      return { data: [] }
    } catch (error) {
      return { error: String(error) }
    }
  }

  const value = {
    isUserAllowed,
    getUserPermissions,
    isInitialized: true,
    service: undefined,
    error: undefined
  }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}
