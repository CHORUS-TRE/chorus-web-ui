import {
  AppInstance,
  AppInstanceCreateType,
  AppInstanceUpdateType
} from '@/domain/model'

interface AppInstanceDataSource {
  create: (appInstance: AppInstanceCreateType) => Promise<string>
  get: (id: string) => Promise<AppInstance>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<AppInstance[]>
  update: (appInstance: AppInstanceUpdateType) => Promise<AppInstance>
}

export type { AppInstanceDataSource }
