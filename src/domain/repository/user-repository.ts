import { UserCreateModel, UserResponse } from '@/domain/model'

interface UserRepository {
  create: (user: UserCreateModel) => Promise<UserResponse>
  me: () => Promise<UserResponse>
  get: (id: string) => Promise<UserResponse>
}

export type { UserRepository }
