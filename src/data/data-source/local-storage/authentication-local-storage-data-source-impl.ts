import { AuthenticationDataSource } from '@/data/data-source/'
import {
  AuthenticationMode,
  AuthenticationModeType,
  AuthenticationRequest
} from '@/domain/model'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const storage = require('node-persist')

class AuthenticationLocalStorageDataSourceImpl
  implements AuthenticationDataSource
{
  private static instance: AuthenticationLocalStorageDataSourceImpl

  static async getInstance(
    dir = './.local-storage'
  ): Promise<AuthenticationLocalStorageDataSourceImpl> {
    if (!AuthenticationLocalStorageDataSourceImpl.instance) {
      AuthenticationLocalStorageDataSourceImpl.instance =
        new AuthenticationLocalStorageDataSourceImpl()
      await storage.init({ dir })
    }

    return AuthenticationLocalStorageDataSourceImpl.instance
  }

  async login(data: AuthenticationRequest): Promise<string> {
    try {
      const existing = await storage.getItem(data.email)
      if (!existing) {
        throw new Error('User not found')
      }

      return data.email
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getAuthenticationModes(): Promise<AuthenticationMode[]> {
    // For local development, return a simple internal authentication mode
    return [
      {
        type: AuthenticationModeType.INTERNAL,
        internal: {
          enabled: true
        }
      }
    ]
  }
}

export { AuthenticationLocalStorageDataSourceImpl }
