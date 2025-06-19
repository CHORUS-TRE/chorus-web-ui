import { AppCreateType, AppUpdateType } from '@/domain/model'
import { ChorusApp } from '~/internal/client'

export const toChorusApp = (app: AppCreateType): ChorusApp => {
  const { ...rest } = app
  return {
    ...rest
  }
}

export const toChorusAppUpdate = (app: AppUpdateType): ChorusApp => {
  const { ...rest } = app
  return {
    ...rest
  }
}
