import { Result } from '@/domain/model'
import { User, UserCreateType, UserUpdateType } from '@/domain/model/user'

interface UserRepository {
  create: (user: UserCreateType) => Promise<Result<User>>
  me: () => Promise<Result<User>>
  get: (id: string) => Promise<Result<User>>
  delete: (id: string) => Promise<Result<string>>
  list: () => Promise<Result<User[]>>
  update: (user: UserUpdateType) => Promise<Result<User>>
}

export type { UserRepository }
