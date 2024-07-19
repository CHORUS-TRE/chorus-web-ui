'use client'

import AuthenticationRepositoryImpl from '@/data/repository/authentication-repository-impl'
import AuthenticationMockApiDataSourceImpl from '@/data/data-source/mock-api/authentication-mock-api-data-source-impl'
import { AuthenticationLogin } from '@/domain/use-cases/authentication/authentication-login'
import { useAuth } from '~/components/auth-context'

export default function authenticationLoginViewModel() {
  const { setAuthentication } = useAuth()

  const authenticationDataSource = new AuthenticationMockApiDataSourceImpl()
  const authenticationRepository = new AuthenticationRepositoryImpl(
    authenticationDataSource
  )
  const useCase = new AuthenticationLogin(authenticationRepository)

  const login = async (username: string, password: string) => {
    const response = await useCase.execute({ username, password })

    if (response?.error) throw new Error(response.error.message)
    if (response?.data.token) setAuthentication(response?.data.token)

    return response?.data.token
  }

  return { login }
}
