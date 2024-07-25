import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
import { AuthenticationDataSource } from '../authentication-data-source'
import { BASE_URL, TypedResponse, myFetch } from './utils'

export interface AuthenticationMockApiEntity {
  token: string
}

class AuthenticationMockApiDataSourceImpl implements AuthenticationDataSource {
  async login(d: AuthenticationRequest): Promise<AuthenticationResponse> {
    const response = await myFetch<AuthenticationResponse>(
      `${BASE_URL}/authentication/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
      }
    )
    const data: AuthenticationResponse = await response.json()

    return data
  }
}

export default AuthenticationMockApiDataSourceImpl
