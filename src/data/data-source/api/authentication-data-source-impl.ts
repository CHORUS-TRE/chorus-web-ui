import { AuthenticationDataSource } from '@/data/data-source/'
import { AuthenticationRequest, AuthenticationResponse } from '~/domain/model'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    throw new Error('Method not implemented.')
  }
}

export default AuthenticationApiDataSourceImpl
