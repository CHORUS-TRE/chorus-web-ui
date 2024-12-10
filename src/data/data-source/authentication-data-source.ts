import { AuthenticationMode, AuthenticationRequest } from '@/domain/model'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<string>
  getAuthenticationModes: () => Promise<AuthenticationMode[]>
  getOAuthUrl: (id: string) => Promise<string>
}

export type { AuthenticationDataSource }
