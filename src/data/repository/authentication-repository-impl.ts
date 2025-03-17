import {
  AuthenticationModesResponse,
  AuthenticationOAuthRedirectRequest,
  AuthenticationOAuthRedirectResponse,
  AuthenticationOAuthResponse,
  AuthenticationRequest,
  AuthenticationResponse,
  LogoutResponse
} from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

import { AuthenticationDataSource } from '../data-source'

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private dataSource: AuthenticationDataSource

  constructor(dataSource: AuthenticationDataSource) {
    this.dataSource = dataSource
  }

  async login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const d = await this.dataSource.login(data)

      return { data: d }
    } catch (error) {
      console.error({ error })
      return { error: error.statusText }
    }
  }

  async getAuthenticationModes(): Promise<AuthenticationModesResponse> {
    try {
      const modes = await this.dataSource.getAuthenticationModes()
      return { data: modes }
    } catch (error) {
      console.error(error)
      return { error }
    }
  }

  async getOAuthUrl(id: string): Promise<AuthenticationOAuthResponse> {
    try {
      const url = await this.dataSource.getOAuthUrl(id)
      return { data: url }
    } catch (error) {
      return { error: error.message }
    }
  }

  async handleOAuthRedirect(
    data: AuthenticationOAuthRedirectRequest
  ): Promise<AuthenticationOAuthRedirectResponse> {
    try {
      const token = await this.dataSource.handleOAuthRedirect(data)
      return { data: token }
    } catch (error) {
      return { error: error.message }
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      await this.dataSource.logout()
      return {}
    } catch (error) {
      return { error: error.message }
    }
  }
}
