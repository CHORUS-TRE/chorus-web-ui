import { AuthenticationRequest } from '@/domain/model'

interface AuthenticationDataSource {
  login: (data: AuthenticationRequest) => Promise<string>
}

export type { AuthenticationDataSource }
