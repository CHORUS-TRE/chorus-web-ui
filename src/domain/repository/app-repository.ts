import { AppCreate, AppResponse, AppsResponse } from '@/domain/model'

interface AppRepository {
  list: () => Promise<AppsResponse>
  create: (app: AppCreate) => Promise<AppResponse>
  update: (app: AppCreate & { id: string }) => Promise<AppResponse>
  delete: (id: string) => Promise<AppResponse>
  get: (id: string) => Promise<AppResponse>
}

export type { AppRepository }
