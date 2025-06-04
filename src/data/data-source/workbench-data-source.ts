import {
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '@/domain/model'

interface WorkbenchDataSource {
  create: (workbench: WorkbenchCreateType) => Promise<string>
  get: (id: string) => Promise<Workbench>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<Workbench[]>
  update: (workbench: WorkbenchUpdateType) => Promise<Workbench>
}

export type { WorkbenchDataSource }
