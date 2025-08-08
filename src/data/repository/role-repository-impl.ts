import { Result, Role } from '@/domain/model'
import { RoleRepository } from '@/domain/repository'

import { RoleDataSource } from '../data-source/chorus-api/role-data-source'

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly dataSource: RoleDataSource) {}

  async list(): Promise<Result<Role[]>> {
    return this.dataSource.list()
  }
  async get(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roleId: string
  ): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    role: Role
  ): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  async update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    role: Role
  ): Promise<Result<Role>> {
    throw new Error('Method not implemented.')
  }
  async delete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roleId: string
  ): Promise<Result<string>> {
    throw new Error('Method not implemented.')
  }
  async assignUserRole(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roleId: string
  ): Promise<Result<boolean>> {
    throw new Error('Method not implemented.')
  }
  async unassignUserRole(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    roleId: string
  ): Promise<Result<boolean>> {
    throw new Error('Method not implemented.')
  }
}
