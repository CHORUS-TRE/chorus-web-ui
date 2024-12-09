import { AuthenticationDataSource } from '@/data/data-source/'
import {
  AuthenticationInternal,
  AuthenticationMode,
  AuthenticationModeType,
  AuthenticationOpenID,
  AuthenticationRequest
} from '@/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis'
import { ChorusAuthenticationMode } from '@/internal/client/models'

import { env } from '~/env'
import { Configuration } from '~/internal/client'

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  private configuration: Configuration
  private service: AuthenticationServiceApi

  constructor() {
    this.configuration = new Configuration({
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

  async getAuthenticationModes(): Promise<AuthenticationMode[]> {
    try {
      const response =
        await this.service.authenticationServiceGetAuthenticationModes()

      if (!response.result) {
        return []
      }

      const result = response.result
      console.log(result)
      const r = result.map(
        (mode: ChorusAuthenticationMode): AuthenticationMode => {
          const authMode: AuthenticationMode = {
            type: mode.type as AuthenticationModeType,
            internal: mode.internal
              ? ({
                  enabled: mode.internal.publicRegistrationEnabled ?? false
                } as AuthenticationInternal)
              : undefined,
            openid: mode.openid
              ? ({
                  id: mode.openid.id ?? ''
                } as AuthenticationOpenID)
              : undefined
          }
          return authMode
        }
      )

      console.log(r)
      return r
    } catch (error) {
      console.error('Error fetching authentication modes:', error)
      throw error
    }
  }
}

export { AuthenticationApiDataSourceImpl }
