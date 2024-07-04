import { User } from '@/domain/model/user'
import UserDataSource from '@/data/data-source/user-data-source'
import { UserDBEntity } from '@/data/data-source/mock-api/entity/user-db-entity'

const BASE_URL = 'http://localhost:3000/api'

interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}

function myFetch<T>(...args: any): Promise<TypedResponse<T>> {
  return fetch.apply(window, args)
}

class UserDBDataSourceImpl implements UserDataSource {
  async authenticateUser(
    username: string,
    password: string
  ): Promise<{ data: User; error: Error | null }> {
    const response = await myFetch<{ data: UserDBEntity; error: Error | null }>(
      `${BASE_URL}/authenticate`
    )
    const { data, error } = await response.json()

    const user = {
      id: data.id,
      firstName: data.name.split(' ')[0] || '',
      lastName: data.name.split(' ')[1] || '',
      username: data.username,
      email: data.email,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'token'
    }

    return { data: user, error }
  }

  async getUsers(): Promise<{ data: User[]; error: Error | null }> {
    const response = await myFetch<{
      data: UserDBEntity[]
      error: Error | null
    }>(`${BASE_URL}/users`)
    const { data, error } = await response.json()

    const responseData: User[] = data.map((dbUser) => ({
      id: dbUser.id,
      firstName: dbUser.name.split(' ')[0] || '',
      lastName: dbUser.name.split(' ')[1] || '',
      username: dbUser.username,
      email: dbUser.email,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'token'
    }))

    return { data: responseData, error }
  }
}

export default UserDBDataSourceImpl
