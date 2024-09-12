import { AppInstance, AppInstanceCreateModel } from '@/domain/model'

interface AppInstanceDataSource {
  create: (workbench: AppInstanceCreateModel) => Promise<string>
  get: (id: string) => Promise<AppInstance>
}

export type { AppInstanceDataSource }
