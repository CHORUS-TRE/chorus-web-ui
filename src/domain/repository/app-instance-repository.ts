import {
  AppInstanceCreateType,
  AppInstanceResponse,
  AppInstancesResponse,
  AppInstanceUpdateType
} from '@/domain/model'

interface AppInstanceRepository {
  create: (appInstance: AppInstanceCreateType) => Promise<AppInstanceResponse>
  get: (id: string) => Promise<AppInstanceResponse>
  delete: (id: string) => Promise<AppInstanceResponse>
  list: () => Promise<AppInstancesResponse>
  update: (appInstance: AppInstanceUpdateType) => Promise<AppInstanceResponse>
}

export type { AppInstanceRepository }
