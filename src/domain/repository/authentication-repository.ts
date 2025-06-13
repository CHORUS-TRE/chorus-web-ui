import {
  AuthenticationModesResponse,
  AuthenticationOAuthRedirectRequest,
  AuthenticationOAuthRedirectResponse,
  AuthenticationOAuthResponse,
  AuthenticationRequest,
  AuthenticationResponse,
  LogoutResponse
} from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
  getAuthenticationModes: () => Promise<AuthenticationModesResponse>
  getOAuthUrl: (id: string) => Promise<AuthenticationOAuthResponse>
  handleOAuthRedirect: (
    data: AuthenticationOAuthRedirectRequest
  ) => Promise<AuthenticationOAuthRedirectResponse>
  logout: () => Promise<LogoutResponse>
}

export type { AuthenticationRepository }
