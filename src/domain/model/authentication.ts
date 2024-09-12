export interface AuthenticationRequest {
  email: string
  password: string
}

export interface AuthenticationResponse {
  data?: string
  error?: string
}
