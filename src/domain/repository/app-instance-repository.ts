import {
  AppInstanceCreateModel,
  AppInstanceDeleteResponse,
  AppInstanceResponse,
  AppInstancesResponse,
  AppInstanceUpdateModel
} from '@/domain/model'

interface AppInstanceRepository {
  create: (appInstance: AppInstanceCreateModel) => Promise<AppInstanceResponse>
  get: (id: string) => Promise<AppInstanceResponse>
  delete: (id: string) => Promise<AppInstanceDeleteResponse>
  list: () => Promise<AppInstancesResponse>
  update: (appInstance: AppInstanceUpdateModel) => Promise<AppInstanceResponse>
}

export type { AppInstanceRepository }
