import {
  WorkbenchCreateModel,
  WorkbenchDeleteResponse,
  WorkbenchResponse,
  WorkbenchesResponse
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateModel) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  delete: (id: string) => Promise<WorkbenchDeleteResponse>
  list: () => Promise<WorkbenchesResponse>
}

export type { WorkbenchRepository }
