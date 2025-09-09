import { UserCreateType, UserUpdateType } from '@/domain/model/user'
import { ChorusUser } from '~/internal/client'

export const toChorusUser = (user: UserCreateType): ChorusUser => {
  return {
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName
  }
}

export const toChorusUserUpdate = (user: UserUpdateType): ChorusUser => {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName
  }
}
