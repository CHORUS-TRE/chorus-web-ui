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
import type { ChorusWorkbench } from './ChorusWorkbench'
import {
  ChorusWorkbenchFromJSON,
  ChorusWorkbenchFromJSONTyped,
  ChorusWorkbenchToJSON
} from './ChorusWorkbench'

/**
 *
 * @export
 * @interface ChorusGetWorkbenchResult
 */
export interface ChorusGetWorkbenchResult {
  /**
   *
   * @type {ChorusWorkbench}
   * @memberof ChorusGetWorkbenchResult
   */
  workbench?: ChorusWorkbench
}

/**
 * Check if a given object implements the ChorusGetWorkbenchResult interface.
 */
export function instanceOfChorusGetWorkbenchResult(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusGetWorkbenchResultFromJSON(
  json: any
): ChorusGetWorkbenchResult {
  return ChorusGetWorkbenchResultFromJSONTyped(json, false)
}

export function ChorusGetWorkbenchResultFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusGetWorkbenchResult {
  if (json === undefined || json === null) {
    return json
  }
  return {
    workbench: !exists(json, 'workbench')
      ? undefined
      : ChorusWorkbenchFromJSON(json['workbench'])
  }
}

export function ChorusGetWorkbenchResultToJSON(
  value?: ChorusGetWorkbenchResult | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    workbench: ChorusWorkbenchToJSON(value.workbench)
  }
}
