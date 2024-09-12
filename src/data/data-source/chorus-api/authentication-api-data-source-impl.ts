import { AuthenticationDataSource } from '@/data/data-source/'
import { AuthenticationRequest } from '@/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  authService = new AuthenticationServiceApi()

  async login(data: AuthenticationRequest): Promise<string> {
    try {
      const nextData = { username: data.email, password: data.password }
      const authenticate =
        await this.authService.authenticationServiceAuthenticate({
          body: nextData
        })

      const token = authenticate.result?.token
      if (!token) {
        throw new Error('Invalid credentials')
      }

      return token
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { AuthenticationApiDataSourceImpl }
