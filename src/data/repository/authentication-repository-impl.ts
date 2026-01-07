import {
  AuthenticationMode,
  AuthenticationOAuthRedirectRequest,
  AuthenticationRequest
} from '@/domain/model'
import { Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

import { AuthenticationDataSource } from '../data-source'

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private dataSource: AuthenticationDataSource

  constructor(dataSource: AuthenticationDataSource) {
    this.dataSource = dataSource
  }

  async login(data: AuthenticationRequest): Promise<Result<string>> {
    try {
      const d = await this.dataSource.login(data)

      return { data: d }
    } catch (error) {
      console.error('Error logging in', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async getAuthenticationModes(): Promise<Result<AuthenticationMode[]>> {
    try {
      const modes = await this.dataSource.getAuthenticationModes()
      return { data: modes }
    } catch (error) {
      console.error('Error getting authentication modes', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async getOAuthUrl(id: string): Promise<Result<string>> {
    try {
      const url = await this.dataSource.getOAuthUrl(id)
      return { data: url }
    } catch (error) {
      console.error('Error getting OAuth URL', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async handleOAuthRedirect(
    data: AuthenticationOAuthRedirectRequest
  ): Promise<Result<string>> {
    try {
      const token = await this.dataSource.handleOAuthRedirect(data)
      return { data: token }
    } catch (error) {
      console.error('Error handling OAuth redirect', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async logout(): Promise<Result<string>> {
    try {
      const response = await this.dataSource.logout()

      return { data: response }
    } catch (error) {
      console.error('Error logging out', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
