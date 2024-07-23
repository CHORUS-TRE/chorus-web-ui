import { AuthenticationRequest, AuthenticationResponse } from '~/domain/model'
import { AuthenticationDataSource } from '../authentication-data-source'

const BASE_URL = 'http://localhost:3000/api/rest/v1/'

interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}
function myFetch<T>(...args: any): Promise<TypedResponse<T>> {
  return fetch.apply(window, args)
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
