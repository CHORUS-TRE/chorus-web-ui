import { UserResponse } from '@/domain/model'

interface UserRepository {
  me: () => Promise<UserResponse>
}

export type { UserRepository }
