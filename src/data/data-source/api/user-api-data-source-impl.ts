import { User, UserResponse } from '@/domain/model'
import { UserDataSource } from '@/data/data-source'
import { UserServiceApi } from '@/internal/client/apis'
import { Configuration } from '@/internal/client'

class UserApiDataSourceImpl implements UserDataSource {
  private configuration: Configuration
  private service: UserServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.service = new UserServiceApi(this.configuration)
  }

  async me(): Promise<UserResponse> {
    try {
      const user = await this.service.userServiceGetUserMe()

      if (!user?.result?.me)
        return { data: null, error: new Error('User not found') }

      const nextUser: User = {
        ...user?.result?.me,
        id: user?.result?.me?.id || '',
        firstName: user?.result?.me?.firstName || '',
        lastName: user?.result?.me?.lastName || '',
        username: user?.result?.me?.username || '',
        status: user?.result?.me?.status ? 'active' : 'inactive',
        roles: user?.result?.me?.roles && ['user'],
        createdAt: new Date(user?.result?.me?.createdAt || ''),
        updatedAt: new Date(user?.result?.me?.updatedAt || ''),
        email: ''
      }

      return { data: nextUser, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
}

export { UserApiDataSourceImpl }
