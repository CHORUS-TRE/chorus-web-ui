import { UserCreateType, UserResponse, UsersResponse } from '@/domain/model'

interface UserRepository {
  create: (user: UserCreateType) => Promise<UserResponse>
  me: () => Promise<UserResponse>
  get: (id: string) => Promise<UserResponse>
  list: () => Promise<UsersResponse>
}

export type { UserRepository }
