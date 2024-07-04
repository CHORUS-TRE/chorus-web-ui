import { User } from '@/domain/model/user'
interface UserDataSource {
  authenticateUser(
    username: string,
    password: string
  ): Promise<{ data: User; error: Error | null }>
  getUsers(): Promise<{ data: User[]; error: Error | null }>
}

export default UserDataSource
