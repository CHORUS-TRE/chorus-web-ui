import { Result, Role } from '../model'

export interface RoleRepository {
  list(): Promise<Result<Role[]>>
  get(roleId: string): Promise<Result<Role>>
  create(role: Role): Promise<Result<Role>>
  update(role: Role): Promise<Result<Role>>
  delete(roleId: string): Promise<Result<string>>
  assignUserRole(userId: string, roleId: string): Promise<Result<boolean>>
  unassignUserRole(userId: string, roleId: string): Promise<Result<boolean>>
}
