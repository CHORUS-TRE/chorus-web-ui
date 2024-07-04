import { useState } from 'react'
import { User } from '@/domain/model'
import { AuthenticateUser } from '@/domain/use-cases/user/authenticate-user'
import UserRepositoryImpl from '@/data/repository/user-repository-impl'
import UserDataSource from '@/data/data-source/mock-api/user-db-data-source-impl'

export default function userAuthenticateViewModel() {
  const [user, setUser] = useState<{ data: User; error: Error | null }>()

  const useCase = new AuthenticateUser(
    new UserRepositoryImpl(new UserDataSource())
  )

  const authenticate = async (username: string, password: string) => {
    const user = await useCase.execute(username, password)
    setUser(user)
  }

  return { authenticate, user }
}
