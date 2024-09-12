import {
  WorkbenchCreate as WorkbenchCreateModel,
  WorkbenchDeleteResponse,
  WorkbenchesResponse,
  WorkbenchResponse
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateModel) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  delete: (id: string) => Promise<WorkbenchDeleteResponse>
  list: () => Promise<WorkbenchesResponse>
}

export type { WorkbenchRepository }
