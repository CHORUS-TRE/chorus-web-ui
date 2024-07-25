import { AuthenticationDataSource } from '@/data/data-source/'
import { AuthenticationRequest, AuthenticationResponse } from '~/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis/AuthenticationServiceApi'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  authService = new AuthenticationServiceApi()

  async login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const authenticate =
        await this.authService.authenticationServiceAuthenticate({ body: data })

      const token = authenticate.result?.token
      if (!token) {
        return { data: null, error: new Error('Invalid credentials') }
      }

      return { data: { token }, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
}

export default AuthenticationApiDataSourceImpl
