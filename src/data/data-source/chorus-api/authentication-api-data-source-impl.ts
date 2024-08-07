import { AuthenticationDataSource } from '@/data/data-source/'
import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  authService = new AuthenticationServiceApi()

  async login(data: AuthenticationRequest): Promise<string> {
    try {
      const authenticate =
        await this.authService.authenticationServiceAuthenticate({ body: data })

      const token = authenticate.result?.token
      if (!token) {
        throw new Error('Invalid credentials')
      }

      return token
    } catch (error: any) {
      throw error
    }
  }
}

export { AuthenticationApiDataSourceImpl }
