import { App, AppCreateType, AppUpdateType, Result } from '@/domain/model'

interface AppRepository {
  get: (id: string) => Promise<Result<App>>
  list: () => Promise<Result<App[]>>
  create: (app: AppCreateType) => Promise<Result<App>>
  update: (app: AppUpdateType) => Promise<Result<App>>
  delete: (id: string) => Promise<Result<boolean>>
}

export type { AppRepository }
