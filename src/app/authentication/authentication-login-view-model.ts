import { useState } from 'react'
import AuthenticationRepositoryImpl from '@/data/repository/authentication-repository-impl'
import AuthenticationMockApiDataSourceImpl from '@/data/data-source/mock-api/authentication-mock-api-data-source-impl'
import { AuthenticationResponse } from '@/domain/model'

export default function authenticationLoginViewModel() {
  const [authentication, setAuthentication] = useState<AuthenticationResponse>()

  const useCase = new AuthenticationRepositoryImpl(
    new AuthenticationMockApiDataSourceImpl()
  )

  const login = async (username: string, password: string) => {
    const response = await useCase.login({ username, password })
    setAuthentication(response)

    return response
  }

  return { authentication, login }
}
