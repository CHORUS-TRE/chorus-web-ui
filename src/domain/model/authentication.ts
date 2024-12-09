export interface AuthenticationRequest {
  email: string
  password: string
}

export interface AuthenticationResponse {
  data?: string
  error?: string
}

export const AuthenticationModeType = {
  INTERNAL: 'internal',
  OPENID: 'openid'
} as const

export type AuthenticationModeType =
  (typeof AuthenticationModeType)[keyof typeof AuthenticationModeType]

export interface AuthenticationOpenID {
  id: string
}

export interface AuthenticationInternal {
  enabled: boolean
}

export interface AuthenticationMode {
  type: AuthenticationModeType
  internal?: AuthenticationInternal
  openid?: AuthenticationOpenID
}

export interface AuthenticationModesResponse {
  data?: AuthenticationMode[]
  error?: string
}
