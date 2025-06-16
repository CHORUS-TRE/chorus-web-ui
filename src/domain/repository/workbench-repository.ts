import {
  Result,
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '../model'

export interface WorkbenchRepository {
  list: () => Promise<Result<Workbench[]>>
  create: (workbench: WorkbenchCreateType) => Promise<Result<Workbench>>
  update: (workbench: WorkbenchUpdateType) => Promise<Result<Workbench>>
  delete: (id: string) => Promise<Result<boolean>>
  get: (id: string) => Promise<Result<Workbench>>
}
