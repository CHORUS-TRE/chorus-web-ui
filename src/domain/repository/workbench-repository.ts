import {
  Result,
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '../model'
import { User } from '../model/user'

export interface WorkbenchRepository {
  list: () => Promise<Result<Workbench[]>>
  create: (workbench: WorkbenchCreateType) => Promise<Result<Workbench>>
  update: (workbench: WorkbenchUpdateType) => Promise<Result<Workbench>>
  delete: (id: string) => Promise<Result<string>>
  get: (id: string) => Promise<Result<Workbench>>
  streamProbe: (id: string) => Promise<Result<boolean>>
  streamUrl: (id: string) => Promise<Result<string>>
  manageUserRole: (
    workbenchId: string,
    userId: string,
    roleName: string
  ) => Promise<Result<User>>
}
