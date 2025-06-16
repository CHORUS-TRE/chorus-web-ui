import { UserCreateType, UserUpdateType } from '@/domain/model/user'
import { ChorusUser } from '~/internal/client'

export const toChorusUser = (user: UserCreateType): ChorusUser => {
  return {
    ...user
  }
}

export const toChorusUserUpdate = (user: UserUpdateType): ChorusUser => {
  return {
    ...user
  }
}
