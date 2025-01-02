import {
  Workbench,
  WorkbenchCreate as WorkbenchCreateModel,
  WorkbenchUpdate
} from '@/domain/model'

interface WorkbenchDataSource {
  create: (workbench: WorkbenchCreateModel) => Promise<string>
  get: (id: string) => Promise<Workbench>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<Workbench[]>
  update: (workbench: WorkbenchUpdate) => Promise<Workbench>
}

export type { WorkbenchDataSource }
