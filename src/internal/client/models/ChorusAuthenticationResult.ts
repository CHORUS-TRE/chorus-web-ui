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
 * @interface ChorusAuthenticationResult
 */
export interface ChorusAuthenticationResult {
  /**
   *
   * @type {string}
   * @memberof ChorusAuthenticationResult
   */
  token?: string
}

/**
 * Check if a given object implements the ChorusAuthenticationResult interface.
 */
export function instanceOfChorusAuthenticationResult(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusAuthenticationResultFromJSON(
  json: any
): ChorusAuthenticationResult {
  return ChorusAuthenticationResultFromJSONTyped(json, false)
}

export function ChorusAuthenticationResultFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusAuthenticationResult {
  if (json === undefined || json === null) {
    return json
  }
  return {
    token: !exists(json, 'token') ? undefined : json['token']
  }
}

export function ChorusAuthenticationResultToJSON(
  value?: ChorusAuthenticationResult | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    token: value.token
  }
}