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
 * @interface ChorusUpdatePasswordRequest
 */
export interface ChorusUpdatePasswordRequest {
  /**
   *
   * @type {string}
   * @memberof ChorusUpdatePasswordRequest
   */
  currentPassword?: string
  /**
   *
   * @type {string}
   * @memberof ChorusUpdatePasswordRequest
   */
  newPassword?: string
}

/**
 * Check if a given object implements the ChorusUpdatePasswordRequest interface.
 */
export function instanceOfChorusUpdatePasswordRequest(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusUpdatePasswordRequestFromJSON(
  json: any
): ChorusUpdatePasswordRequest {
  return ChorusUpdatePasswordRequestFromJSONTyped(json, false)
}

export function ChorusUpdatePasswordRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusUpdatePasswordRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    currentPassword: !exists(json, 'currentPassword')
      ? undefined
      : json['currentPassword'],
    newPassword: !exists(json, 'newPassword') ? undefined : json['newPassword']
  }
}

export function ChorusUpdatePasswordRequestToJSON(
  value?: ChorusUpdatePasswordRequest | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    currentPassword: value.currentPassword,
    newPassword: value.newPassword
  }
}