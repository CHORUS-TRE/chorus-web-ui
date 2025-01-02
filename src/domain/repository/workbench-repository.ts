import {
  WorkbenchCreate as WorkbenchCreateModel,
  WorkbenchDeleteResponse,
  WorkbenchesResponse,
  WorkbenchResponse,
  WorkbenchUpdate
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateModel) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  delete: (id: string) => Promise<WorkbenchDeleteResponse>
  list: () => Promise<WorkbenchesResponse>
  update: (workbench: WorkbenchUpdate) => Promise<WorkbenchResponse>
}

export type { WorkbenchRepository }
