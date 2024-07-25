import { User, UserResponse } from '@/domain/model/user'
import { UserDataSource } from '@/data/data-source'
import { BASE_URL, TypedResponse, myFetch } from './utils'

export interface UserEntity {
  id: string
  name: string
  username: string
  email: string
}

class UserDBDataSourceImpl implements UserDataSource {
  async me(): Promise<UserResponse> {
    throw new Error('Method not implemented.')
  }
}

export default UserDBDataSourceImpl
