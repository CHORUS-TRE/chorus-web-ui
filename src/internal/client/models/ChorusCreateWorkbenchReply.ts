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
import type { ChorusCreateWorkbenchResult } from './ChorusCreateWorkbenchResult'
import {
  ChorusCreateWorkbenchResultFromJSON,
  ChorusCreateWorkbenchResultFromJSONTyped,
  ChorusCreateWorkbenchResultToJSON
} from './ChorusCreateWorkbenchResult'

/**
 *
 * @export
 * @interface ChorusCreateWorkbenchReply
 */
export interface ChorusCreateWorkbenchReply {
  /**
   *
   * @type {ChorusCreateWorkbenchResult}
   * @memberof ChorusCreateWorkbenchReply
   */
  result?: ChorusCreateWorkbenchResult
}

/**
 * Check if a given object implements the ChorusCreateWorkbenchReply interface.
 */
export function instanceOfChorusCreateWorkbenchReply(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusCreateWorkbenchReplyFromJSON(
  json: any
): ChorusCreateWorkbenchReply {
  return ChorusCreateWorkbenchReplyFromJSONTyped(json, false)
}

export function ChorusCreateWorkbenchReplyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusCreateWorkbenchReply {
  if (json === undefined || json === null) {
    return json
  }
  return {
    result: !exists(json, 'result')
      ? undefined
      : ChorusCreateWorkbenchResultFromJSON(json['result'])
  }
}

export function ChorusCreateWorkbenchReplyToJSON(
  value?: ChorusCreateWorkbenchReply | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    result: ChorusCreateWorkbenchResultToJSON(value.result)
  }
}