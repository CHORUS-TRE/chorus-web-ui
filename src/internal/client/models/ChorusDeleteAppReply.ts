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
 * @interface ChorusDeleteAppReply
 */
export interface ChorusDeleteAppReply {
  /**
   *
   * @type {object}
   * @memberof ChorusDeleteAppReply
   */
  result?: object
}

/**
 * Check if a given object implements the ChorusDeleteAppReply interface.
 */
export function instanceOfChorusDeleteAppReply(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusDeleteAppReplyFromJSON(json: any): ChorusDeleteAppReply {
  return ChorusDeleteAppReplyFromJSONTyped(json, false)
}

export function ChorusDeleteAppReplyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusDeleteAppReply {
  if (json === undefined || json === null) {
    return json
  }
  return {
    result: !exists(json, 'result') ? undefined : json['result']
  }
}

export function ChorusDeleteAppReplyToJSON(
  value?: ChorusDeleteAppReply | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    result: value.result
  }
}