export interface AuthenticationRequest {
  username: string
  password: string
}

export interface AuthenticationResponse {
  data: string | null
  error: Error | null
}
