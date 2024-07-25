import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'
import { AuthenticationDataSource } from '@/data/data-source'

export default class AuthenticationRepositoryImpl
  implements AuthenticationRepository
{
  private dataSource: AuthenticationDataSource

  constructor(dataSource: AuthenticationDataSource) {
    this.dataSource = dataSource
  }

  async login(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    return await this.dataSource.login(data)
  }
}
