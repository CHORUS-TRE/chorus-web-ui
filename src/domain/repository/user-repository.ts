import {
  UserCreatedResponse,
  UserCreateModel,
  UserResponse,
  UsersResponse
} from '@/domain/model'

interface UserRepository {
  create: (user: UserCreateModel) => Promise<UserCreatedResponse>
  me: () => Promise<UserResponse>
  get: (id: string) => Promise<UserResponse>
  list: () => Promise<UsersResponse>
}

export type { UserRepository }
