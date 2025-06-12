import { App, AppCreate } from '@/domain/model'

interface AppDataSource {
  list: () => Promise<App[]>
  create: (app: AppCreate) => Promise<App>
  update: (app: AppCreate & { id: string }) => Promise<App>
  delete: (id: string) => Promise<App>
  get: (id: string) => Promise<App>
}

export type { AppDataSource }
