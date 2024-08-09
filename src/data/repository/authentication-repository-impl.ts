import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
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
    } catch (error: any) {
      return { error: error.message }
    }
  }
}
