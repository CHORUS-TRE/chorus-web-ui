import {
  AppInstance,
  AppInstanceCreateType,
  AppInstanceUpdateModel
} from '@/domain/model'

interface AppInstanceDataSource {
  create: (appInstance: AppInstanceCreateType) => Promise<string>
  get: (id: string) => Promise<AppInstance>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<AppInstance[]>
  update: (appInstance: AppInstanceUpdateModel) => Promise<AppInstance>
}

export type { AppInstanceDataSource }
