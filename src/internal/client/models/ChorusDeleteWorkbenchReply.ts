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
 * @interface ChorusDeleteWorkbenchReply
 */
export interface ChorusDeleteWorkbenchReply {
  /**
   *
   * @type {object}
   * @memberof ChorusDeleteWorkbenchReply
   */
  result?: object
}

/**
 * Check if a given object implements the ChorusDeleteWorkbenchReply interface.
 */
export function instanceOfChorusDeleteWorkbenchReply(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusDeleteWorkbenchReplyFromJSON(
  json: any
): ChorusDeleteWorkbenchReply {
  return ChorusDeleteWorkbenchReplyFromJSONTyped(json, false)
}

export function ChorusDeleteWorkbenchReplyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusDeleteWorkbenchReply {
  if (json === undefined || json === null) {
    return json
  }
  return {
    result: !exists(json, 'result') ? undefined : json['result']
  }
}

export function ChorusDeleteWorkbenchReplyToJSON(
  value?: ChorusDeleteWorkbenchReply | null
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