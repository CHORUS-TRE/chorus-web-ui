import { Result, Role } from '@/domain/model'
import { RoleRepository } from '@/domain/repository'

import { RoleDataSource } from '../data-source/chorus-api/role-data-source'

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly dataSource: RoleDataSource) {}

  async list(): Promise<Result<Role[]>> {
    return this.dataSource.list()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(roleId: string): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  async create(role: Role): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(role: Role): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(roleId: string): Promise<Result<string>> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async assignUserRole(
    userId: string,
    roleId: string
  ): Promise<Result<boolean>> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async unassignUserRole(
    userId: string,
    roleId: string
  ): Promise<Result<boolean>> {
    throw new Error('Method not implemented.')
  }
}
