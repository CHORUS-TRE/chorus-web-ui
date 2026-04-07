import { AppCreateType, AppUpdateType } from '@/domain/model'
import { ChorusApp } from '~/internal/client'

export const toChorusApp = (app: AppCreateType): ChorusApp => {
  const { groupedVersions, ...rest } = app
  return {
    ...rest,
    groupedVersions: groupedVersions?.map((v) => ({
      id: v.id ?? undefined,
      dockerImageTag: v.dockerImageTag ?? undefined
    }))
  }
}

export const toChorusAppUpdate = (app: AppUpdateType): ChorusApp => {
  const { groupedVersions, ...rest } = app
  return {
    ...rest,
    groupedVersions: groupedVersions?.map((v) => ({
      id: v.id ?? undefined,
      dockerImageTag: v.dockerImageTag ?? undefined
    }))
  }
}
