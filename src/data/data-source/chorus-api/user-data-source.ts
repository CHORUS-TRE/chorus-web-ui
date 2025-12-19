import {
  UserCreateType,
  UserRoleCreateType,
  UserUpdateType
} from '@/domain/model/user'
import {
  ChorusCreateUserReply,
  ChorusCreateUserRoleReply,
  ChorusDeleteUserReply,
  ChorusGetUserMeReply,
  ChorusGetUserReply,
  ChorusListUsersReply,
  ChorusUpdateUserReply,
  Configuration,
  UserServiceApi,
  UserServiceListUsersRequest
} from '~/internal/client'

import { toChorusUser, toChorusUserUpdate } from './user-mapper'

interface UserDataSource {
  me: () => Promise<ChorusGetUserMeReply>
  create: (user: UserCreateType) => Promise<ChorusCreateUserReply>
  createRole: (
    userRole: UserRoleCreateType
  ) => Promise<ChorusCreateUserRoleReply>
  deleteRole: (userId: string, roleId: string) => Promise<ChorusCreateUserReply>
  get: (id: string) => Promise<ChorusGetUserReply>
  delete: (id: string) => Promise<ChorusDeleteUserReply>
  list: (filters: UserServiceListUsersRequest) => Promise<ChorusListUsersReply>
  update: (user: UserUpdateType) => Promise<ChorusUpdateUserReply>
}

export type { UserDataSource }

class UserApiDataSourceImpl implements UserDataSource {
  private service: UserServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new UserServiceApi(configuration)
  }

  create(user: UserCreateType): Promise<ChorusCreateUserReply> {
    const chorusUser = toChorusUser(user)
    return this.service.userServiceCreateUser({
      body: {
        ...chorusUser,
        status: 'active'
      }
    })
  }

  async createRole(
    userRole: UserRoleCreateType
  ): Promise<ChorusCreateUserRoleReply> {
    return this.service.userServiceCreateUserRole({
      userId: userRole.userId,
      body: {
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
          context: userRole.role.context
        }
      }
    })
  }

  deleteRole(userId: string, roleId: string): Promise<ChorusCreateUserReply> {
    return this.service.userServiceDeleteUserRole({
      userId,
      roleId
    })
  }

  me(): Promise<ChorusGetUserMeReply> {
    return this.service.userServiceGetUserMe()
  }

  get(id: string): Promise<ChorusGetUserReply> {
    return this.service.userServiceGetUser({ id })
  }

  delete(id: string): Promise<ChorusDeleteUserReply> {
    return this.service.userServiceDeleteUser({ id })
  }

  list(filters: UserServiceListUsersRequest): Promise<ChorusListUsersReply> {
    return this.service.userServiceListUsers(filters)
  }

  update(user: UserUpdateType): Promise<ChorusUpdateUserReply> {
    const chorusUser = toChorusUserUpdate(user)
    return this.service.userServiceUpdateUser({
      body: {
        ...chorusUser,
        status: 'active'
      }
    })
  }
}

export { UserApiDataSourceImpl }
