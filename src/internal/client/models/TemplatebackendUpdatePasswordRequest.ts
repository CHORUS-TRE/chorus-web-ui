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
/**
 * 
 * @export
 * @interface TemplatebackendUpdatePasswordRequest
 */
export interface TemplatebackendUpdatePasswordRequest {
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendUpdatePasswordRequest
     */
    currentPassword?: string;
    /**
     * 
     * @type {string}
     * @memberof TemplatebackendUpdatePasswordRequest
     */
    newPassword?: string;
}

/**
 * Check if a given object implements the TemplatebackendUpdatePasswordRequest interface.
 */
export function instanceOfTemplatebackendUpdatePasswordRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendUpdatePasswordRequestFromJSON(json: any): TemplatebackendUpdatePasswordRequest {
    return TemplatebackendUpdatePasswordRequestFromJSONTyped(json, false);
}

export function TemplatebackendUpdatePasswordRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendUpdatePasswordRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'currentPassword': !exists(json, 'currentPassword') ? undefined : json['currentPassword'],
        'newPassword': !exists(json, 'newPassword') ? undefined : json['newPassword'],
    };
}

export function TemplatebackendUpdatePasswordRequestToJSON(value?: TemplatebackendUpdatePasswordRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'currentPassword': value.currentPassword,
        'newPassword': value.newPassword,
    };
}
