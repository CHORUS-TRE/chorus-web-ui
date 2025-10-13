'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import type { User } from '@/domain/model/user'
import { Result } from '~/domain/model'

interface WasmUser {
  roles: Array<{
    name: string
    description: string
    permissions: Array<{
      name: string
      description: string
    }>
  }>
}

interface WasmAuthenticationService {
  isUserAllowed: (permission: { name: string; description: string }) => boolean
  getUserPermissions: () => string[]
}

declare global {
  class Go {
    importObject: WebAssembly.Imports
    run(instance: WebAssembly.Instance): Promise<void>
  }

  interface Window {
    createAuthenticationService: (user: WasmUser) => WasmAuthenticationService
  }
}

// Define the shape of the context
interface AuthorizationContextType {
  isUserAllowed: (user: User, permission: string) => Promise<Result<boolean>>
  getUserPermissions: (user: User) => Result<string[]>
  isInitialized: boolean
  error?: string
}

// Create the context with a default value
const AuthorizationContext = createContext<AuthorizationContextType>({
  isUserAllowed: async () => ({ data: false }),
  getUserPermissions: () => ({ data: [] }),
  isInitialized: false,
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
  const [isWasmInitialized, setIsWasmInitialized] = useState(false)

  useEffect(() => {
    async function loadWasm() {
      if (typeof window !== 'undefined') {
        const wasmExec = document.createElement('script')
        wasmExec.src = '/wasm_exec.js'
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

          if (typeof window.createAuthenticationService === 'function') {
            setIsWasmInitialized(true)
          } else {
            console.log('createAuthenticationService not found globally')
            console.log(
              'Available global functions:',
              Object.keys(window).filter(
                (key) => typeof window[key as keyof Window] === 'function'
              )
            )
            setIsWasmInitialized(false)
          }
        })
      }
    }

    loadWasm()
  }, [])

  const isUserAllowed = async (
    user: User,
    permission: string
  ): Promise<Result<boolean>> => {
    try {
      if (isWasmInitialized) {
        // Convert user to WASM format
        const wasmUser: WasmUser = {
          roles:
            user.rolesWithContext?.map((role) => ({
              name: role.name,
              description: `Role: ${role.name}`,
              permissions: [
                {
                  name: `${role.name}:read`,
                  description: `Read permission for ${role.name}`
                },
                {
                  name: `${role.name}:write`,
                  description: `Write permission for ${role.name}`
                }
              ]
            })) || []
        }

        // Create a new service instance for this user
        const userService = window.createAuthenticationService(wasmUser)

        // Call isUserAllowed with permission object
        const permissionObj = {
          name: permission,
          description: `Permission: ${permission}`
        }
        const isAllowed = userService.isUserAllowed(permissionObj)

        console.log(`WASM isUserAllowed result for ${permission}:`, isAllowed)
        return { data: isAllowed }
      }

      // Fallback when WASM not initialized
      return { data: false }
    } catch (error) {
      console.error('Error in isUserAllowed:', error)
      return { error: String(error) }
    }
  }

  const getUserPermissions = (user: User): Result<string[]> => {
    try {
      if (isWasmInitialized) {
        // Convert user to WASM format
        const wasmUser: WasmUser = {
          roles:
            user.rolesWithContext?.map((role) => ({
              name: role.name,
              description: `Role: ${role.name}`,
              permissions: [
                {
                  name: `${role.name}:read`,
                  description: `Read permission for ${role.name}`
                },
                {
                  name: `${role.name}:write`,
                  description: `Write permission for ${role.name}`
                }
              ]
            })) || []
        }

        // Create a new service instance for this user
        const userService = window.createAuthenticationService(wasmUser)

        // Get user permissions
        const permissions = userService.getUserPermissions()

        return { data: permissions }
      }

      // Fallback when WASM not initialized
      return { data: [] }
    } catch (error) {
      console.error('Error in getUserPermissions:', error)
      return { error: String(error) }
    }
  }

  const value = {
    isUserAllowed,
    getUserPermissions,
    isInitialized: isWasmInitialized,
    error: undefined
  }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}
