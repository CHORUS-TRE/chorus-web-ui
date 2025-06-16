import { AppCreateType, AppUpdateType } from '@/domain/model'
import { ChorusApp } from '~/internal/client'

export const toChorusApp = (app: AppCreateType): ChorusApp => {
  const { preset, ...rest } = app
  return {
    ...rest
  }
}

export const toChorusAppUpdate = (app: AppUpdateType): ChorusApp => {
  const { preset, ...rest } = app
  return {
    ...rest
  }
}
