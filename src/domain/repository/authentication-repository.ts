import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'

interface AuthenticationRepository {
  login: (data: AuthenticationRequest) => Promise<AuthenticationResponse>
}

export type { AuthenticationRepository }
