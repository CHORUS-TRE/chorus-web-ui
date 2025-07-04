/* tslint:disable */
/* eslint-disable */
/**
 * CHORUS backend API
 * CHORUS backend API documentation
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime'
/**
 *
 * @export
 * @interface AuthenticationServiceAuthenticateOauthRedirectBody
 */
export interface AuthenticationServiceAuthenticateOauthRedirectBody {
  /**
   *
   * @type {string}
   * @memberof AuthenticationServiceAuthenticateOauthRedirectBody
   */
  state?: string
  /**
   *
   * @type {string}
   * @memberof AuthenticationServiceAuthenticateOauthRedirectBody
   */
  sessionState?: string
  /**
   *
   * @type {string}
   * @memberof AuthenticationServiceAuthenticateOauthRedirectBody
   */
  code?: string
}

/**
 * Check if a given object implements the AuthenticationServiceAuthenticateOauthRedirectBody interface.
 */
export function instanceOfAuthenticationServiceAuthenticateOauthRedirectBody(
  value: object
): boolean {
  let isInstance = true

  return isInstance
}

export function AuthenticationServiceAuthenticateOauthRedirectBodyFromJSON(
  json: any
): AuthenticationServiceAuthenticateOauthRedirectBody {
  return AuthenticationServiceAuthenticateOauthRedirectBodyFromJSONTyped(
    json,
    false
  )
}

export function AuthenticationServiceAuthenticateOauthRedirectBodyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AuthenticationServiceAuthenticateOauthRedirectBody {
  if (json === undefined || json === null) {
    return json
  }
  return {
    state: !exists(json, 'state') ? undefined : json['state'],
    sessionState: !exists(json, 'sessionState')
      ? undefined
      : json['sessionState'],
    code: !exists(json, 'code') ? undefined : json['code']
  }
}

export function AuthenticationServiceAuthenticateOauthRedirectBodyToJSON(
  value?: AuthenticationServiceAuthenticateOauthRedirectBody | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    state: value.state,
    sessionState: value.sessionState,
    code: value.code
  }
}
