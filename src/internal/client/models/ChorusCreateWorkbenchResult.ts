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
 * @interface ChorusCreateWorkbenchResult
 */
export interface ChorusCreateWorkbenchResult {
  /**
   *
   * @type {string}
   * @memberof ChorusCreateWorkbenchResult
   */
  id?: string
}

/**
 * Check if a given object implements the ChorusCreateWorkbenchResult interface.
 */
export function instanceOfChorusCreateWorkbenchResult(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusCreateWorkbenchResultFromJSON(
  json: any
): ChorusCreateWorkbenchResult {
  return ChorusCreateWorkbenchResultFromJSONTyped(json, false)
}

export function ChorusCreateWorkbenchResultFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusCreateWorkbenchResult {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id']
  }
}

export function ChorusCreateWorkbenchResultToJSON(
  value?: ChorusCreateWorkbenchResult | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id
  }
}
