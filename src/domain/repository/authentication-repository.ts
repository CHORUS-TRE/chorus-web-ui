import {
  AuthenticationModesResponse,
  AuthenticationRequest,
  AuthenticationResponse
} from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
  getAuthenticationModes: () => Promise<AuthenticationModesResponse>
}

export type { AuthenticationRepository }
