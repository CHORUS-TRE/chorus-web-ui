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
 * @interface ChorusCredentials
 */
export interface ChorusCredentials {
  /**
   *
   * @type {string}
   * @memberof ChorusCredentials
   */
  username?: string
  /**
   *
   * @type {string}
   * @memberof ChorusCredentials
   */
  password?: string
  /**
   *
   * @type {string}
   * @memberof ChorusCredentials
   */
  totp?: string
}

/**
 * Check if a given object implements the ChorusCredentials interface.
 */
export function instanceOfChorusCredentials(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusCredentialsFromJSON(json: any): ChorusCredentials {
  return ChorusCredentialsFromJSONTyped(json, false)
}

export function ChorusCredentialsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusCredentials {
  if (json === undefined || json === null) {
    return json
  }
  return {
    username: !exists(json, 'username') ? undefined : json['username'],
    password: !exists(json, 'password') ? undefined : json['password'],
    totp: !exists(json, 'totp') ? undefined : json['totp']
  }
}

export function ChorusCredentialsToJSON(value?: ChorusCredentials | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    username: value.username,
    password: value.password,
    totp: value.totp
  }
}
