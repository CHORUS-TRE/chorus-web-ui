import { Result } from '@/domain/model'
import {
  User,
  UserCreateType,
  UserRoleCreateType,
  UserUpdateType
} from '@/domain/model/user'
import { UserServiceListUsersRequest } from '~/internal/client'

interface UserRepository {
  create: (user: UserCreateType) => Promise<Result<User>>
  createRole: (user: UserRoleCreateType) => Promise<Result<User>>
  deleteRole: (userId: string, roleId: string) => Promise<Result<User>>
  me: () => Promise<Result<User>>
  get: (id: string) => Promise<Result<User>>
  delete: (id: string) => Promise<Result<string>>
  list: (filters?: UserServiceListUsersRequest) => Promise<Result<User[]>>
  update: (user: UserUpdateType) => Promise<Result<User>>
}

export type { UserRepository }
