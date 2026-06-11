import {
  AuthorizationServiceApi,
  ChorusCreateDynamicRoleReply,
  ChorusCreateDynamicRoleRequest,
  ChorusListPermissionsReply,
  ChorusListRolesReply,
  Configuration
} from '@/internal/client'

interface AuthorizationDataSource {
  listRoles(): Promise<ChorusListRolesReply>
  listPermissions(): Promise<ChorusListPermissionsReply>
  createRole(
    body: ChorusCreateDynamicRoleRequest
  ): Promise<ChorusCreateDynamicRoleReply>
}

export type { AuthorizationDataSource }

class AuthorizationApiDataSourceImpl implements AuthorizationDataSource {
  private service: AuthorizationServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new AuthorizationServiceApi(configuration)
  }

  listRoles(): Promise<ChorusListRolesReply> {
    return this.service.authorizationServiceListRoles()
  }

  listPermissions(): Promise<ChorusListPermissionsReply> {
    return this.service.authorizationServiceListPermissions()
  }

  createRole(
    body: ChorusCreateDynamicRoleRequest
  ): Promise<ChorusCreateDynamicRoleReply> {
    return this.service.authorizationServiceCreateDynamicRole({ body })
  }
}

export { AuthorizationApiDataSourceImpl }
