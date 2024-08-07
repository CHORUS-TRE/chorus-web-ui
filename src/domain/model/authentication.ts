export interface AuthenticationRequest {
  email: string
  password: string
}

export interface AuthenticationResponse {
  data: string | null
  error: string | null
}
