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

import * as runtime from '../runtime'
import type {
  ChorusCreateWorkbenchReply,
  ChorusDeleteWorkbenchReply,
  ChorusGetWorkbenchReply,
  ChorusListWorkbenchsReply,
  ChorusUpdateWorkbenchReply,
  ChorusUpdateWorkbenchRequest,
  ChorusWorkbench,
  RpcStatus
} from '../models/index'
import {
  ChorusCreateWorkbenchReplyFromJSON,
  ChorusCreateWorkbenchReplyToJSON,
  ChorusDeleteWorkbenchReplyFromJSON,
  ChorusDeleteWorkbenchReplyToJSON,
  ChorusGetWorkbenchReplyFromJSON,
  ChorusGetWorkbenchReplyToJSON,
  ChorusListWorkbenchsReplyFromJSON,
  ChorusListWorkbenchsReplyToJSON,
  ChorusUpdateWorkbenchReplyFromJSON,
  ChorusUpdateWorkbenchReplyToJSON,
  ChorusUpdateWorkbenchRequestFromJSON,
  ChorusUpdateWorkbenchRequestToJSON,
  ChorusWorkbenchFromJSON,
  ChorusWorkbenchToJSON,
  RpcStatusFromJSON,
  RpcStatusToJSON
} from '../models/index'

export interface WorkbenchServiceCreateWorkbenchRequest {
  body: ChorusWorkbench
}

export interface WorkbenchServiceDeleteWorkbenchRequest {
  id: string
}

export interface WorkbenchServiceGetWorkbenchRequest {
  id: string
}

export interface WorkbenchServiceListWorkbenchsRequest {
  paginationOffset?: number
  paginationLimit?: number
  paginationSortOrder?: string
  paginationSortType?: string
  paginationQuery?: Array<string>
}

export interface WorkbenchServiceUpdateWorkbenchRequest {
  body: ChorusUpdateWorkbenchRequest
}

/**
 *
 */
export class WorkbenchServiceApi extends runtime.BaseAPI {
  /**
   * This endpoint creates a workbench
   * Create a workbench
   */
  async workbenchServiceCreateWorkbenchRaw(
    requestParameters: WorkbenchServiceCreateWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusCreateWorkbenchReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling workbenchServiceCreateWorkbench.'
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/workbenchs`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusWorkbenchToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusCreateWorkbenchReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint creates a workbench
   * Create a workbench
   */
  async workbenchServiceCreateWorkbench(
    requestParameters: WorkbenchServiceCreateWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusCreateWorkbenchReply> {
    const response = await this.workbenchServiceCreateWorkbenchRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint deletes a workbench
   * Delete a workbench
   */
  async workbenchServiceDeleteWorkbenchRaw(
    requestParameters: WorkbenchServiceDeleteWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusDeleteWorkbenchReply>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling workbenchServiceDeleteWorkbench.'
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/workbenchs/{id}`.replace(
          `{${'id'}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: 'DELETE',
        headers: headerParameters,
        query: queryParameters
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusDeleteWorkbenchReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint deletes a workbench
   * Delete a workbench
   */
  async workbenchServiceDeleteWorkbench(
    requestParameters: WorkbenchServiceDeleteWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusDeleteWorkbenchReply> {
    const response = await this.workbenchServiceDeleteWorkbenchRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint returns a workbench
   * Get a workbench
   */
  async workbenchServiceGetWorkbenchRaw(
    requestParameters: WorkbenchServiceGetWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusGetWorkbenchReply>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling workbenchServiceGetWorkbench.'
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/workbenchs/{id}`.replace(
          `{${'id'}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: 'GET',
        headers: headerParameters,
        query: queryParameters
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusGetWorkbenchReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint returns a workbench
   * Get a workbench
   */
  async workbenchServiceGetWorkbench(
    requestParameters: WorkbenchServiceGetWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusGetWorkbenchReply> {
    const response = await this.workbenchServiceGetWorkbenchRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint returns a list of workbenchs
   * List workbenchs
   */
  async workbenchServiceListWorkbenchsRaw(
    requestParameters: WorkbenchServiceListWorkbenchsRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusListWorkbenchsReply>> {
    const queryParameters: any = {}

    if (requestParameters.paginationOffset !== undefined) {
      queryParameters['pagination.offset'] = requestParameters.paginationOffset
    }

    if (requestParameters.paginationLimit !== undefined) {
      queryParameters['pagination.limit'] = requestParameters.paginationLimit
    }

    if (requestParameters.paginationSortOrder !== undefined) {
      queryParameters['pagination.sort.order'] =
        requestParameters.paginationSortOrder
    }

    if (requestParameters.paginationSortType !== undefined) {
      queryParameters['pagination.sort.type'] =
        requestParameters.paginationSortType
    }

    if (requestParameters.paginationQuery) {
      queryParameters['pagination.query'] = requestParameters.paginationQuery
    }

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/workbenchs`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusListWorkbenchsReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint returns a list of workbenchs
   * List workbenchs
   */
  async workbenchServiceListWorkbenchs(
    requestParameters: WorkbenchServiceListWorkbenchsRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusListWorkbenchsReply> {
    const response = await this.workbenchServiceListWorkbenchsRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint updates a workbench
   * Update a workbench
   */
  async workbenchServiceUpdateWorkbenchRaw(
    requestParameters: WorkbenchServiceUpdateWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusUpdateWorkbenchReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling workbenchServiceUpdateWorkbench.'
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/workbenchs`,
        method: 'PUT',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusUpdateWorkbenchRequestToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusUpdateWorkbenchReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint updates a workbench
   * Update a workbench
   */
  async workbenchServiceUpdateWorkbench(
    requestParameters: WorkbenchServiceUpdateWorkbenchRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusUpdateWorkbenchReply> {
    const response = await this.workbenchServiceUpdateWorkbenchRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }
}
