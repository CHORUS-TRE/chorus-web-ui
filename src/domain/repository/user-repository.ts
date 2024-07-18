import { User } from '@/domain/model/user'

interface UserRepository {
  authenticateUser: (
    username: string,
    password: string
  ) => Promise<{ data: User; error: Error | null }>
  getUsers: () => Promise<{ data: User[]; error: Error | null }>
  // createUser: (user: User) => Promise<User>
  // getUserById: (id: string) => Promise<User>
}

export type { UserRepository }
