/* tslint:disable */
/* eslint-disable */
/**
 * template backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * Contact: development.bdsc@chuv.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { TemplatebackendUser } from './TemplatebackendUser';
import {
    TemplatebackendUserFromJSON,
    TemplatebackendUserFromJSONTyped,
    TemplatebackendUserToJSON,
} from './TemplatebackendUser';

/**
 * 
 * @export
 * @interface TemplatebackendGetUserMeResult
 */
export interface TemplatebackendGetUserMeResult {
    /**
     * 
     * @type {TemplatebackendUser}
     * @memberof TemplatebackendGetUserMeResult
     */
    me?: TemplatebackendUser;
}

/**
 * Check if a given object implements the TemplatebackendGetUserMeResult interface.
 */
export function instanceOfTemplatebackendGetUserMeResult(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendGetUserMeResultFromJSON(json: any): TemplatebackendGetUserMeResult {
    return TemplatebackendGetUserMeResultFromJSONTyped(json, false);
}

export function TemplatebackendGetUserMeResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendGetUserMeResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'me': !exists(json, 'me') ? undefined : TemplatebackendUserFromJSON(json['me']),
    };
}

export function TemplatebackendGetUserMeResultToJSON(value?: TemplatebackendGetUserMeResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'me': TemplatebackendUserToJSON(value.me),
    };
}
