import { AuthenticationMode, AuthenticationRequest } from '@/domain/model'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<string>
  getAuthenticationModes: () => Promise<AuthenticationMode[]>
}

export type { AuthenticationDataSource }
