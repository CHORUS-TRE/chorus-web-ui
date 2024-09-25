import { AuthenticationDataSource } from '@/data/data-source/'
import { AuthenticationRequest } from '@/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis'
import { Configuration } from '~/internal/client'
import { env } from '~/env'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  private configuration: Configuration
  private service: AuthenticationServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env.DATA_SOURCE_API_URL
    })
    this.service = new AuthenticationServiceApi(this.configuration)
  }

  async login(data: AuthenticationRequest): Promise<string> {
    try {
      const nextData = { username: data.email, password: data.password }
      const authenticate = await this.service.authenticationServiceAuthenticate(
        {
          body: nextData
        }
      )

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
