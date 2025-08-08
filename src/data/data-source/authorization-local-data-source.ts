import { Role } from '@/domain/model/role'
import { User } from '@/domain/model/user'
import { AuthorizationService } from '@/lib/gatekeeper/dist/index.mjs'

export interface AuthorizationDataSource {
  isUserAllowed(user: User, permission: string): boolean
  getUserPermissions(user: User): string[]
}

export class AuthorizationLocalDataSource implements AuthorizationDataSource {
  private service: InstanceType<typeof AuthorizationService>

  constructor(service: InstanceType<typeof AuthorizationService>) {
    this.service = service
  }

  isUserAllowed(user: User, permission: string): boolean {
    // TODO: The 'user' object needs to be mapped to the structure expected by the WASM module.
    // Assuming the service expects a 'roles' array on the user object.
    const wasmUser = { roles: user.roles2?.map((r: Role) => r.name) ?? [] }
    return this.service.isUserAllowed({ user: wasmUser, permission })
  }

  getUserPermissions(user: User): string[] {
    // TODO: The 'user' object needs to be mapped to the structure expected by the WASM module.
    const wasmUser = { roles: user.roles2?.map((r: Role) => r.name) ?? [] }
    return this.service.getUserPermissions({ user: wasmUser })
  }
}
