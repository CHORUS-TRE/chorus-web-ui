import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
}

export type { AuthenticationDataSource }
