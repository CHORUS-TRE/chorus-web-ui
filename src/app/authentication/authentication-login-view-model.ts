'use client'

import AuthenticationRepositoryImpl from '@/data/repository/authentication-repository-impl'
import AuthenticationMockApiDataSourceImpl from '@/data/data-source/mock-api/authentication-mock-api-data-source-impl'
import { useAuth } from '~/components/auth-context'

export default function authenticationLoginViewModel() {
  const { setAuthentication } = useAuth()

  const useCase = new AuthenticationRepositoryImpl(
    new AuthenticationMockApiDataSourceImpl()
  )

  const login = async (username: string, password: string) => {
    const response = await useCase.login({ username, password })

    if (response?.error) throw new Error(response.error.message)

    if (response?.data.token) setAuthentication(response?.data.token)

    return response?.data.token
  }

  return { login }
}
