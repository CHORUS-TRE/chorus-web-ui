import { AppsResponse } from '@/domain/model'

interface AppRepository {
  list: () => Promise<AppsResponse>
}

export type { AppRepository }
