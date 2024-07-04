import { User } from '@/domain/model/user'

interface UserRepository {
  getUsers: () => Promise<User[]>
  // createUser: (user: User) => Promise<User>
  // getUserById: (id: string) => Promise<User>
}

export type { UserRepository }
