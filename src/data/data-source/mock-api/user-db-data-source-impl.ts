import { User } from '@/domain/model/user'
import UserDataSource from '@/data/data-source/user-data-source'
import { UserDBEntity } from '@/data/data-source/mock-api/entity/user-db-entity'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}

function myFetch<T>(...args: any): Promise<TypedResponse<T>> {
  return fetch.apply(window, args)
}

class UserDBDataSourceImpl implements UserDataSource {
  async getUsers(): Promise<User[]> {
    const response = await myFetch<UserDBEntity[]>(`${BASE_URL}/users`)
    const data = await response.json()

    return data.map((dbUser) => ({
      id: dbUser.id,
      firstName: dbUser.name.split(' ')[0],
      lastName: dbUser.name.split(' ')[1],
      username: dbUser.username,
      email: dbUser.email
    }))
  }
}

export default UserDBDataSourceImpl
