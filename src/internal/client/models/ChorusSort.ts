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
 * @interface ChorusSort
 */
export interface ChorusSort {
  /**
   *
   * @type {string}
   * @memberof ChorusSort
   */
  order?: string
  /**
   *
   * @type {string}
   * @memberof ChorusSort
   */
  type?: string
}

/**
 * Check if a given object implements the ChorusSort interface.
 */
export function instanceOfChorusSort(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusSortFromJSON(json: any): ChorusSort {
  return ChorusSortFromJSONTyped(json, false)
}

export function ChorusSortFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusSort {
  if (json === undefined || json === null) {
    return json
  }
  return {
    order: !exists(json, 'order') ? undefined : json['order'],
    type: !exists(json, 'type') ? undefined : json['type']
  }
}

export function ChorusSortToJSON(value?: ChorusSort | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    order: value.order,
    type: value.type
  }
}