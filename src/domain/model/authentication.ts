export interface AuthenticationRequest {
  username: string
  password: string
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
  buttonText?: string
}

export interface AuthenticationOAuthRedirectRequest {
  id: string
  state?: string
  sessionState?: string
  code?: string
}
