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
  ChorusCreateUserReply,
  ChorusDeleteUserReply,
  ChorusEnableTotpReply,
  ChorusEnableTotpRequest,
  ChorusGetUserMeReply,
  ChorusGetUserReply,
  ChorusGetUsersReply,
  ChorusResetPasswordReply,
  ChorusResetTotpReply,
  ChorusResetTotpRequest,
  ChorusUpdatePasswordReply,
  ChorusUpdatePasswordRequest,
  ChorusUpdateUserReply,
  ChorusUpdateUserRequest,
  ChorusUser,
  RpcStatus
} from '../models/index'
import {
  ChorusCreateUserReplyFromJSON,
  ChorusCreateUserReplyToJSON,
  ChorusDeleteUserReplyFromJSON,
  ChorusDeleteUserReplyToJSON,
  ChorusEnableTotpReplyFromJSON,
  ChorusEnableTotpReplyToJSON,
  ChorusEnableTotpRequestFromJSON,
  ChorusEnableTotpRequestToJSON,
  ChorusGetUserMeReplyFromJSON,
  ChorusGetUserMeReplyToJSON,
  ChorusGetUserReplyFromJSON,
  ChorusGetUserReplyToJSON,
  ChorusGetUsersReplyFromJSON,
  ChorusGetUsersReplyToJSON,
  ChorusResetPasswordReplyFromJSON,
  ChorusResetPasswordReplyToJSON,
  ChorusResetTotpReplyFromJSON,
  ChorusResetTotpReplyToJSON,
  ChorusResetTotpRequestFromJSON,
  ChorusResetTotpRequestToJSON,
  ChorusUpdatePasswordReplyFromJSON,
  ChorusUpdatePasswordReplyToJSON,
  ChorusUpdatePasswordRequestFromJSON,
  ChorusUpdatePasswordRequestToJSON,
  ChorusUpdateUserReplyFromJSON,
  ChorusUpdateUserReplyToJSON,
  ChorusUpdateUserRequestFromJSON,
  ChorusUpdateUserRequestToJSON,
  ChorusUserFromJSON,
  ChorusUserToJSON,
  RpcStatusFromJSON,
  RpcStatusToJSON
} from '../models/index'

export interface UserServiceCreateUserRequest {
  body: ChorusUser
}

export interface UserServiceDeleteUserRequest {
  id: string
}

export interface UserServiceEnableTotpRequest {
  body: ChorusEnableTotpRequest
}

export interface UserServiceGetUserRequest {
  id: string
}

export interface UserServiceResetPasswordRequest {
  id: string
  body: object
}

export interface UserServiceResetTotpRequest {
  body: ChorusResetTotpRequest
}

export interface UserServiceUpdatePasswordRequest {
  body: ChorusUpdatePasswordRequest
}

export interface UserServiceUpdateUserRequest {
  body: ChorusUpdateUserRequest
}

/**
 *
 */
export class UserServiceApi extends runtime.BaseAPI {
  /**
   * This endpoint creates a user
   * Create a user
   */
  async userServiceCreateUserRaw(
    requestParameters: UserServiceCreateUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusCreateUserReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceCreateUser.'
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const response = await this.request(
      {
        path: `/api/rest/v1/users`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusUserToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusCreateUserReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint creates a user
   * Create a user
   */
  async userServiceCreateUser(
    requestParameters: UserServiceCreateUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusCreateUserReply> {
    const response = await this.userServiceCreateUserRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint deletes a user
   * Delete a user
   */
  async userServiceDeleteUserRaw(
    requestParameters: UserServiceDeleteUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusDeleteUserReply>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling userServiceDeleteUser.'
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
        path: `/api/rest/v1/users/{id}`.replace(
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
      ChorusDeleteUserReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint deletes a user
   * Delete a user
   */
  async userServiceDeleteUser(
    requestParameters: UserServiceDeleteUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusDeleteUserReply> {
    const response = await this.userServiceDeleteUserRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint enables the TOTP of the authenticated user
   * Enable TOTP
   */
  async userServiceEnableTotpRaw(
    requestParameters: UserServiceEnableTotpRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusEnableTotpReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceEnableTotp.'
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
        path: `/api/rest/v1/users/me/totp/enable`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusEnableTotpRequestToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusEnableTotpReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint enables the TOTP of the authenticated user
   * Enable TOTP
   */
  async userServiceEnableTotp(
    requestParameters: UserServiceEnableTotpRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusEnableTotpReply> {
    const response = await this.userServiceEnableTotpRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint returns a user
   * Get a user
   */
  async userServiceGetUserRaw(
    requestParameters: UserServiceGetUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusGetUserReply>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling userServiceGetUser.'
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
        path: `/api/rest/v1/users/{id}`.replace(
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
      ChorusGetUserReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint returns a user
   * Get a user
   */
  async userServiceGetUser(
    requestParameters: UserServiceGetUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusGetUserReply> {
    const response = await this.userServiceGetUserRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint returns the details of the authenticated user
   * Get my own user
   */
  async userServiceGetUserMeRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusGetUserMeReply>> {
    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/users/me`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusGetUserMeReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint returns the details of the authenticated user
   * Get my own user
   */
  async userServiceGetUserMe(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusGetUserMeReply> {
    const response = await this.userServiceGetUserMeRaw(initOverrides)
    return await response.value()
  }

  /**
   * This endpoint returns a list of users
   * List users
   */
  async userServiceGetUsersRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusGetUsersReply>> {
    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] =
        this.configuration.apiKey('Authorization') // bearer authentication
    }

    const response = await this.request(
      {
        path: `/api/rest/v1/users`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusGetUsersReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint returns a list of users
   * List users
   */
  async userServiceGetUsers(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusGetUsersReply> {
    const response = await this.userServiceGetUsersRaw(initOverrides)
    return await response.value()
  }

  /**
   * This endpoint resets a user\'s password
   * Reset password
   */
  async userServiceResetPasswordRaw(
    requestParameters: UserServiceResetPasswordRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusResetPasswordReply>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling userServiceResetPassword.'
      )
    }

    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceResetPassword.'
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
        path: `/api/rest/v1/users/{id}/password/reset`.replace(
          `{${'id'}}`,
          encodeURIComponent(String(requestParameters.id))
        ),
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: requestParameters.body as any
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusResetPasswordReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint resets a user\'s password
   * Reset password
   */
  async userServiceResetPassword(
    requestParameters: UserServiceResetPasswordRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusResetPasswordReply> {
    const response = await this.userServiceResetPasswordRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint resets the TOTP of the authenticated user
   * Reset TOTP
   */
  async userServiceResetTotpRaw(
    requestParameters: UserServiceResetTotpRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusResetTotpReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceResetTotp.'
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
        path: `/api/rest/v1/users/me/totp/reset`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusResetTotpRequestToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusResetTotpReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint resets the TOTP of the authenticated user
   * Reset TOTP
   */
  async userServiceResetTotp(
    requestParameters: UserServiceResetTotpRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusResetTotpReply> {
    const response = await this.userServiceResetTotpRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint updates the password of the authenticated user
   * Update password
   */
  async userServiceUpdatePasswordRaw(
    requestParameters: UserServiceUpdatePasswordRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusUpdatePasswordReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceUpdatePassword.'
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
        path: `/api/rest/v1/users/me/password`,
        method: 'PUT',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusUpdatePasswordRequestToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusUpdatePasswordReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint updates the password of the authenticated user
   * Update password
   */
  async userServiceUpdatePassword(
    requestParameters: UserServiceUpdatePasswordRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusUpdatePasswordReply> {
    const response = await this.userServiceUpdatePasswordRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }

  /**
   * This endpoint updates a user
   * Update a user
   */
  async userServiceUpdateUserRaw(
    requestParameters: UserServiceUpdateUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ChorusUpdateUserReply>> {
    if (
      requestParameters.body === null ||
      requestParameters.body === undefined
    ) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling userServiceUpdateUser.'
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
        path: `/api/rest/v1/users`,
        method: 'PUT',
        headers: headerParameters,
        query: queryParameters,
        body: ChorusUpdateUserRequestToJSON(requestParameters.body)
      },
      initOverrides
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ChorusUpdateUserReplyFromJSON(jsonValue)
    )
  }

  /**
   * This endpoint updates a user
   * Update a user
   */
  async userServiceUpdateUser(
    requestParameters: UserServiceUpdateUserRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ChorusUpdateUserReply> {
    const response = await this.userServiceUpdateUserRaw(
      requestParameters,
      initOverrides
    )
    return await response.value()
  }
}