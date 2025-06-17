import {
  AppInstance,
  AppInstanceCreateType,
  AppInstanceUpdateType,
  Result
} from '~/domain/model'

interface AppInstanceRepository {
  create: (appInstance: AppInstanceCreateType) => Promise<Result<AppInstance>>
  get: (id: string) => Promise<Result<AppInstance>>
  delete: (id: string) => Promise<Result<string>>
  list: () => Promise<Result<AppInstance[]>>
  update: (appInstance: AppInstanceUpdateType) => Promise<Result<AppInstance>>
}

export type { AppInstanceRepository }
