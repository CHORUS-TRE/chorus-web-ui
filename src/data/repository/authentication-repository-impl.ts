import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'
import { AuthenticationServiceApi } from '~/internal/client'

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private authService

  constructor() {
    this.authService = new AuthenticationServiceApi()
  }

  async login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const response = await this.authService.authenticationServiceAuthenticate(
        { body: data }
      )

      const token = response.result?.token
      if (!token) {
        return { data: null, error: 'Invalid credentials' }
      }

      return { data: token, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
}
