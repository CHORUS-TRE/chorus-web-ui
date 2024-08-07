import {
  WorkbenchCreateModel,
  WorkbenchResponse,
  WorkbenchesResponse
} from '@/domain/model'

interface WorkbenchRepository {
  create: (workbench: WorkbenchCreateModel) => Promise<WorkbenchResponse>
  get: (id: string) => Promise<WorkbenchResponse>
  list: () => Promise<WorkbenchesResponse>
}

export type { WorkbenchRepository }
