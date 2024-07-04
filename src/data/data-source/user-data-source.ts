import { User } from '@/domain/model/user'

interface UserDataSource {
  getUsers(): Promise<User[]>
}

export default UserDataSource
