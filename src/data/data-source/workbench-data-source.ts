import { Workbench, WorkbenchCreateModel } from '@/domain/model'

interface WorkbenchDataSource {
  create: (workbench: WorkbenchCreateModel) => Promise<string>
  get: (id: string) => Promise<Workbench>
  list: () => Promise<Workbench[]>
}

export type { WorkbenchDataSource }
