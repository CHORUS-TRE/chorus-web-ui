import {
  WorkbenchCreateType,
  WorkbenchesResponse,
  WorkbenchResponse,
  WorkbenchUpdateType
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateType) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  delete: (id: string) => Promise<WorkbenchResponse>
  list: () => Promise<WorkbenchesResponse>
  update: (workbench: WorkbenchUpdateType) => Promise<WorkbenchResponse>
}

export type { WorkbenchRepository }
