import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<string>
}

export type { AuthenticationDataSource }
