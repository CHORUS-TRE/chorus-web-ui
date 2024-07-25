import { UserResponse } from '@/domain/model'
interface UserDataSource {
  me: () => Promise<UserResponse>
}

export type { UserDataSource }
