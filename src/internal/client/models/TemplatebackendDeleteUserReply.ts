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
 * @interface TemplatebackendDeleteUserReply
 */
export interface TemplatebackendDeleteUserReply {
    /**
     * 
     * @type {object}
     * @memberof TemplatebackendDeleteUserReply
     */
    result?: object;
}

/**
 * Check if a given object implements the TemplatebackendDeleteUserReply interface.
 */
export function instanceOfTemplatebackendDeleteUserReply(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TemplatebackendDeleteUserReplyFromJSON(json: any): TemplatebackendDeleteUserReply {
    return TemplatebackendDeleteUserReplyFromJSONTyped(json, false);
}

export function TemplatebackendDeleteUserReplyFromJSONTyped(json: any, ignoreDiscriminator: boolean): TemplatebackendDeleteUserReply {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'result': !exists(json, 'result') ? undefined : json['result'],
    };
}

export function TemplatebackendDeleteUserReplyToJSON(value?: TemplatebackendDeleteUserReply | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'result': value.result,
    };
}
