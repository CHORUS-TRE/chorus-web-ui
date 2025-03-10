import {
  AuthenticationMode,
  AuthenticationOAuthRedirectRequest,
  AuthenticationRequest
} from '@/domain/model'

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
