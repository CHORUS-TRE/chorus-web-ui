import {
  AuthenticationModesResponse,
  AuthenticationOAuthRedirectRequest,
  AuthenticationOAuthRedirectResponse,
  AuthenticationOAuthResponse,
  AuthenticationRequest,
  AuthenticationResponse
} from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
  getAuthenticationModes: () => Promise<AuthenticationModesResponse>
  getOAuthUrl: (id: string) => Promise<AuthenticationOAuthResponse>
  handleOAuthRedirect: (
    data: AuthenticationOAuthRedirectRequest
  ) => Promise<AuthenticationOAuthRedirectResponse>
}

export type { AuthenticationRepository }
