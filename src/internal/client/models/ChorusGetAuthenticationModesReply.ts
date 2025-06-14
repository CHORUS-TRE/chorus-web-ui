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
import type { ChorusAuthenticationMode } from './ChorusAuthenticationMode'
import {
  ChorusAuthenticationModeFromJSON,
  ChorusAuthenticationModeFromJSONTyped,
  ChorusAuthenticationModeToJSON
} from './ChorusAuthenticationMode'

/**
 *
 * @export
 * @interface ChorusGetAuthenticationModesReply
 */
export interface ChorusGetAuthenticationModesReply {
  /**
   *
   * @type {Array<ChorusAuthenticationMode>}
   * @memberof ChorusGetAuthenticationModesReply
   */
  result?: Array<ChorusAuthenticationMode>
}

/**
 * Check if a given object implements the ChorusGetAuthenticationModesReply interface.
 */
export function instanceOfChorusGetAuthenticationModesReply(
  value: object
): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusGetAuthenticationModesReplyFromJSON(
  json: any
): ChorusGetAuthenticationModesReply {
  return ChorusGetAuthenticationModesReplyFromJSONTyped(json, false)
}

export function ChorusGetAuthenticationModesReplyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusGetAuthenticationModesReply {
  if (json === undefined || json === null) {
    return json
  }
  return {
    result: !exists(json, 'result')
      ? undefined
      : (json['result'] as Array<any>).map(ChorusAuthenticationModeFromJSON)
  }
}

export function ChorusGetAuthenticationModesReplyToJSON(
  value?: ChorusGetAuthenticationModesReply | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    result:
      value.result === undefined
        ? undefined
        : (value.result as Array<any>).map(ChorusAuthenticationModeToJSON)
  }
}
