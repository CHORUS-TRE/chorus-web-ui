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
import type { ChorusApp } from './ChorusApp'
import {
  ChorusAppFromJSON,
  ChorusAppFromJSONTyped,
  ChorusAppToJSON
} from './ChorusApp'

/**
 *
 * @export
 * @interface ChorusUpdateAppRequest
 */
export interface ChorusUpdateAppRequest {
  /**
   *
   * @type {ChorusApp}
   * @memberof ChorusUpdateAppRequest
   */
  app?: ChorusApp
}

/**
 * Check if a given object implements the ChorusUpdateAppRequest interface.
 */
export function instanceOfChorusUpdateAppRequest(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ChorusUpdateAppRequestFromJSON(
  json: any
): ChorusUpdateAppRequest {
  return ChorusUpdateAppRequestFromJSONTyped(json, false)
}

export function ChorusUpdateAppRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ChorusUpdateAppRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    app: !exists(json, 'app') ? undefined : ChorusAppFromJSON(json['app'])
  }
}

export function ChorusUpdateAppRequestToJSON(
  value?: ChorusUpdateAppRequest | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    app: ChorusAppToJSON(value.app)
  }
}