export interface AuthenticationRequest {
  username: string
  password: string
}

export interface AuthenticationResponse {
  data: {
    token: string
  } | null
  error: Error | null
}
