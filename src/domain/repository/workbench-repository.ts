import {
  WorkbenchCreateModel,
  WorkbenchDeleteResponse,
  WorkbenchesResponse,
  WorkbenchResponse,
  WorkbenchUpdateModel
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateModel) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  delete: (id: string) => Promise<WorkbenchDeleteResponse>
  list: () => Promise<WorkbenchesResponse>
  update: (workbench: WorkbenchUpdateModel) => Promise<WorkbenchResponse>
}

export type { WorkbenchRepository }
