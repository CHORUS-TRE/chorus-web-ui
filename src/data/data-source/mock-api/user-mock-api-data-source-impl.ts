import { User, UserResponse } from '@/domain/model/user'
import { UserDataSource } from '@/data/data-source'
import { UserDBEntity } from '@/data/data-source/mock-api/entity/user-db-entity'

const BASE_URL = 'http://localhost:3000/api'

interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}

function myFetch<T>(...args: any): Promise<TypedResponse<T>> {
  return fetch.apply(window, args)
}

class UserDBDataSourceImpl implements UserDataSource {
  async me(): Promise<UserResponse> {
    const response = await myFetch<{ data: UserDBEntity; error: Error | null }>(
      `${BASE_URL}/authenticate`
    )
    const { data, error } = await response.json()

    const user: User = {
      id: data.id,
      firstName: data.name.split(' ')[0] || '',
      lastName: data.name.split(' ')[1] || '',
      username: data.username,
      email: data.email,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return { data: user, error }
  }
}

export default UserDBDataSourceImpl
