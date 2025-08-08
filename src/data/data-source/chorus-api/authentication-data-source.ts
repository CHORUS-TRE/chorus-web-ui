import {
  AuthenticationInternal,
  AuthenticationMode,
  AuthenticationModeType,
  AuthenticationOAuthRedirectRequest,
  AuthenticationOpenID,
  AuthenticationRequest
} from '@/domain/model'
import { AuthenticationServiceApi } from '@/internal/client/apis'
import { ChorusAuthenticationMode } from '@/internal/client/models'
import { Configuration } from '~/internal/client'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<string>
  getAuthenticationModes: () => Promise<AuthenticationMode[]>
  getOAuthUrl: (id: string) => Promise<string>
  handleOAuthRedirect: (
    data: AuthenticationOAuthRedirectRequest
  ) => Promise<string>
  logout: () => Promise<void>
}

export type { AuthenticationDataSource }

class AuthenticationApiDataSourceImpl implements AuthenticationDataSource {
  private configuration: Configuration
  private service: AuthenticationServiceApi
  private serviceWithoutCredentials: AuthenticationServiceApi

  constructor(basePath: string) {
    this.configuration = new Configuration({
      basePath,
      credentials: 'include'
    })

    this.service = new AuthenticationServiceApi(this.configuration)

    this.serviceWithoutCredentials = new AuthenticationServiceApi(
      new Configuration({
        basePath,
        credentials: 'omit'
      })
    )
  }

  async login(data: AuthenticationRequest): Promise<string> {
    try {
      const nextData = { username: data.username, password: data.password }
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
      // console.error(error)
      throw error instanceof Error
        ? error
        : new Error('Unknown authentication error occurred')
    }
  }

  async getAuthenticationModes(): Promise<AuthenticationMode[]> {
    try {
      const response =
        await this.serviceWithoutCredentials.authenticationServiceGetAuthenticationModes()

      if (!response.result) {
        return []
      }

      const result = response.result
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
      return r
    } catch (error) {
      console.error(
        ' data source getAuthenticationModes Error fetching authentication modes:',
        error
      )
      throw error
    }
  }

  async getOAuthUrl(id: string): Promise<string> {
    try {
      const response =
        await this.service.authenticationServiceAuthenticateOauth({ id })

      if (!response.result?.redirectURI) {
        throw new Error('No redirect URL provided')
      }

      return response.result.redirectURI
    } catch (error) {
      console.error('Error getting OAuth URL:', error)
      throw error
    }
  }

  async handleOAuthRedirect(
    data: AuthenticationOAuthRedirectRequest
  ): Promise<string> {
    try {
      const response =
        await this.service.authenticationServiceAuthenticateOauthRedirect({
          id: data.id,
          state: data.state,
          sessionState: data.sessionState,
          code: data.code
        })

      if (!response.result?.token) {
        throw new Error('No token received from OAuth redirect')
      }

      return response.result.token
    } catch (error) {
      console.error('Error handling OAuth redirect:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    const response = await this.service.authenticationServiceLogout({
      body: {}
    })

    if (!response) {
      throw new Error('Failed to logout')
    }
  }
}

export { AuthenticationApiDataSourceImpl }
