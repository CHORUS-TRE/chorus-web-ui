import { App } from '@/domain/model'

interface AppDataSource {
  list: () => Promise<App[]>
}

export type { AppDataSource }
