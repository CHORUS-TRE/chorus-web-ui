import {
  UserCreatedResponse,
  UserCreateModel,
  UserResponse
} from '@/domain/model'

interface UserRepository {
  create: (user: UserCreateModel) => Promise<UserCreatedResponse>
  me: () => Promise<UserResponse>
  get: (id: string) => Promise<UserResponse>
}

export type { UserRepository }
