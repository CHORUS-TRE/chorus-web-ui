import {
  AuthenticationMode,
  AuthenticationOAuthRedirectRequest,
  AuthenticationRequest,
  Result
} from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<Result<string>>
  getAuthenticationModes: () => Promise<Result<AuthenticationMode[]>>
  getOAuthUrl: (id: string) => Promise<Result<string>>
  handleOAuthRedirect: (
    data: AuthenticationOAuthRedirectRequest
  ) => Promise<Result<string>>
  logout: () => Promise<Result<string>>
}

export type { AuthenticationRepository }
