import { Role } from '@/domain/model/role'
import { User } from '@/domain/model/user'
// import { AuthorizationService } from '@/lib/gatekeeper/dist/index.mjs'
// import { AuthorizationService } from '@/data/data-source/service'

export interface AuthorizationDataSource {
  isUserAllowed(user: User, permission: string): boolean
  getUserPermissions(user: User): string[]
}

export class AuthorizationLocalDataSource implements AuthorizationDataSource {
  // private service: InstanceType<typeof AuthorizationService>
  // private initialized = false
  // constructor(service: InstanceType<typeof AuthorizationService>) {
  //   this.service = service
  // }
  // async init() {
  //   if (!this.initialized) {
  //     console.log('Initializing AuthorizationLocalDataSource...')
  //     // Perform initialization logic here
  //     await this.service.initializeWasm() // Ensure the AuthorizationService is initialized
  //     if (!this.service.initialized) {
  //       throw new Error('AuthorizationService not initialized. Call and await init() first.')
  //     }
  //     console.log('AuthorizationLocalDataSource initialized successfully.')
  //     this.initialized = true
  //   }
  // }
  // isUserAllowed(user: User, permission: string): boolean {
  //   try {
  //     // Check if the WASM program is active and initialized
  //     if (!this.service || typeof this.service.isUserAllowed !== 'function') {
  //       throw new Error('Authorization service is not initialized or has exited.')
  //     }
  //     if (!this.service.initialized) {
  //       throw new Error('AuthorizationService not initialized. Call and await init() first.')
  //     }
  //     // Map the 'user' object to the structure expected by the WASM module
  //     const wasmUser = { roles: user.roles2?.map((r: Role) => r.name) ?? [] }
  //     return this.service.isUserAllowed({ user: wasmUser, permission })
  //   } catch (error) {
  //     console.error('Error in isUserAllowed:', error)
  //     return false // Return false in case of an error
  //   }
  // }
  // getUserPermissions(user: User): string[] {
  //   // TODO: The 'user' object needs to be mapped to the structure expected by the WASM module.
  //   const wasmUser = { roles: user.roles2?.map((r: Role) => r.name) ?? [] }
  //   return this.service.getUserPermissions({ user: wasmUser })
  // }
}
