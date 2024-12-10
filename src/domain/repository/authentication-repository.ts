import {
  AuthenticationModesResponse,
  AuthenticationOAuthResponse,
  AuthenticationRequest,
  AuthenticationResponse
} from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
  getAuthenticationModes: () => Promise<AuthenticationModesResponse>
  getOAuthUrl: (id: string) => Promise<AuthenticationOAuthResponse>
}

export type { AuthenticationRepository }
