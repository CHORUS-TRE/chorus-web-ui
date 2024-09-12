import { AppInstanceCreateModel, AppInstanceResponse } from '@/domain/model'

interface AppInstanceRepository {
  create: (AppInstance: AppInstanceCreateModel) => Promise<AppInstanceResponse>
  get: (id: string) => Promise<AppInstanceResponse>
  // delete: (id: string) => Promise<AppInstanceDeleteResponse>
  // list: () => Promise<AppInstanceesResponse>
}

export type { AppInstanceRepository }
