import { UserCreateType, UserUpdateType } from '@/domain/model/user'
import {
  ChorusCreateUserReply,
  ChorusDeleteUserReply,
  ChorusGetUserMeReply,
  ChorusGetUserReply,
  ChorusGetUsersReply,
  ChorusUpdateUserReply,
  Configuration,
  UserServiceApi
} from '~/internal/client'

import { toChorusUser, toChorusUserUpdate } from './user-mapper'

interface UserDataSource {
  me: () => Promise<ChorusGetUserMeReply>
  create: (user: UserCreateType) => Promise<ChorusCreateUserReply>
  get: (id: string) => Promise<ChorusGetUserReply>
  delete: (id: string) => Promise<ChorusDeleteUserReply>
  list: () => Promise<ChorusGetUsersReply>
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
        roles: ['admin'],
        status: 'active'
      }
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

  list(): Promise<ChorusGetUsersReply> {
    return this.service.userServiceGetUsers()
  }

  update(user: UserUpdateType): Promise<ChorusUpdateUserReply> {
    const chorusUser = toChorusUserUpdate(user)
    return this.service.userServiceUpdateUser({
      body: {
        user: chorusUser
      }
    })
  }
}

export { UserApiDataSourceImpl }
