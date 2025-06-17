import {
  AppInstanceCreateType,
  AppInstanceUpdateType
} from '@/domain/model/app-instance'
import { ChorusAppInstance } from '~/internal/client'

export const toChorusAppInstance = (
  appInstance: AppInstanceCreateType
): ChorusAppInstance => {
  return {
    ...appInstance
  }
}

export const toChorusAppInstanceUpdate = (
  appInstance: AppInstanceUpdateType
): ChorusAppInstance => {
  return {
    ...appInstance
  }
}
